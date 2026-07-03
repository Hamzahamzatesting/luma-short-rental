"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, EMAIL_FROM } from "@/lib/email/client";
import { bookingConfirmationEmail, bookingConfirmationSubject } from "@/lib/email/booking-confirmation";
import { bookingCancellationEmail, bookingCancellationSubject } from "@/lib/email/booking-cancellation";
import { getCancellationTerms } from "@/lib/cancellation-policy";
import type { BookingStatus, CancellationPolicy } from "@/lib/data/types";

export type BookingActionResult = { error: string } | { ok: true };

async function loadBookingForEmail(bookingId: string) {
  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, listing:listings(title, city, images, price_currency)")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking) return null;

  const { data: authUser } = await supabase.auth.admin.getUserById(booking.user_id);
  return { booking, email: authUser?.user?.email };
}

async function siteOrigin() {
  const h = await headers();
  return h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function confirmBooking(formData: FormData): Promise<BookingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const supabase = createAdminClient();

  const { error } = await supabase.from("bookings").update({ status: "confirmed" }).eq("id", id);
  if (error) return { error: "Could not confirm this booking." };

  const loaded = await loadBookingForEmail(id);
  if (loaded?.email) {
    try {
      const origin = await siteOrigin();
      const resend = getResendClient();
      await resend.emails.send({
        from: EMAIL_FROM,
        to: loaded.email,
        subject: bookingConfirmationSubject(loaded.booking.listing?.title ?? "your stay"),
        html: bookingConfirmationEmail({
          listingTitle: loaded.booking.listing?.title ?? "Listing",
          listingImage: loaded.booking.listing?.images?.[0] ?? "",
          listingCity: loaded.booking.listing?.city ?? "",
          checkIn: loaded.booking.check_in,
          checkOut: loaded.booking.check_out,
          nights: loaded.booking.nights,
          guests: loaded.booking.guests,
          pricePerNight: loaded.booking.price_per_night_snapshot,
          cleaningFee: loaded.booking.cleaning_fee_snapshot,
          serviceFee: loaded.booking.service_fee,
          total: loaded.booking.total,
          currency: loaded.booking.listing?.price_currency ?? "MAD",
          confirmationUrl: `${origin}/bookings/${id}/confirmation`,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send admin-confirmed booking email:", emailError);
    }
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  return { ok: true };
}

async function setCancelled(id: string, reason: string | undefined, notify: boolean): Promise<BookingActionResult> {
  const supabase = createAdminClient();

  const { data: current } = await supabase
    .from("bookings")
    .select("check_in, listing:listings(cancellation_policy)")
    .eq("id", id)
    .maybeSingle();
  const policy = (current?.listing as unknown as { cancellation_policy: CancellationPolicy | null } | null)
    ?.cancellation_policy;
  const refundPercent = current ? getCancellationTerms(policy ?? undefined, current.check_in).refundPercent : null;

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", admin_notes: reason ?? null, refund_percent: refundPercent })
    .eq("id", id);
  if (error) return { error: "Could not update this booking." };

  if (notify) {
    const loaded = await loadBookingForEmail(id);
    if (loaded?.email) {
      try {
        const origin = await siteOrigin();
        const resend = getResendClient();
        await resend.emails.send({
          from: EMAIL_FROM,
          to: loaded.email,
          subject: bookingCancellationSubject(loaded.booking.listing?.title ?? "your stay"),
          html: bookingCancellationEmail({
            listingTitle: loaded.booking.listing?.title ?? "Listing",
            listingImage: loaded.booking.listing?.images?.[0] ?? "",
            listingCity: loaded.booking.listing?.city ?? "",
            checkIn: loaded.booking.check_in,
            checkOut: loaded.booking.check_out,
            reason,
            siteUrl: origin,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send booking cancellation email:", emailError);
      }
    }
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/bookings");
  return { ok: true };
}

export async function rejectBooking(formData: FormData): Promise<BookingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const reason = (formData.get("reason") as string) || "This request could not be accommodated.";
  return setCancelled(id, reason, true);
}

export async function cancelBookingAdmin(formData: FormData): Promise<BookingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const reason = (formData.get("reason") as string) || undefined;
  return setCancelled(id, reason, true);
}

const MANUAL_STATUSES: BookingStatus[] = [
  "pending",
  "awaiting_payment",
  "confirmed",
  "checked_in",
  "checked_out",
  "refunded",
  "completed",
];

export async function updateBookingStatus(formData: FormData): Promise<BookingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const status = formData.get("status") as BookingStatus;
  if (!MANUAL_STATUSES.includes(status)) return { error: "Not a valid status." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) return { error: "Could not update the booking status." };

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  return { ok: true };
}

export async function updateBookingDates(formData: FormData): Promise<BookingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const checkIn = formData.get("checkIn") as string;
  const checkOut = formData.get("checkOut") as string;

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return { error: "Check-out must be after check-in." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("bookings")
    .update({ check_in: checkIn, check_out: checkOut })
    .eq("id", id);

  if (error) {
    if (error.code === "23P01") {
      return { error: "Those dates overlap another reservation for this property." };
    }
    return { error: "Could not move this booking." };
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  return { ok: true };
}

export async function addBookingNote(formData: FormData): Promise<BookingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const note = formData.get("note") as string;
  if (!note?.trim()) return { error: "Note can't be empty." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("bookings").update({ admin_notes: note.trim() }).eq("id", id);
  if (error) return { error: "Could not save the note." };

  revalidatePath(`/admin/bookings/${id}`);
  return { ok: true };
}
