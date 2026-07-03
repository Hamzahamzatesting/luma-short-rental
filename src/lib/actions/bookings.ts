"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getListingBySlug } from "@/lib/data/listings";
import { canCancelBooking } from "@/lib/data/bookings";
import { getResendClient, EMAIL_FROM } from "@/lib/email/client";
import { bookingConfirmationEmail, bookingConfirmationSubject } from "@/lib/email/booking-confirmation";
import { bookingCancellationEmail, bookingCancellationSubject } from "@/lib/email/booking-cancellation";
import { adminNewBookingEmail, adminNewBookingSubject } from "@/lib/email/admin-new-booking";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getCancellationTerms } from "@/lib/cancellation-policy";
import type { BookingStatus, CancellationPolicy } from "@/lib/data/types";

export type BookingFormState = { error?: string } | undefined;
export type CancelBookingResult = { error: string } | { ok: true };

const SERVICE_FEE_RATE = 0.08;

function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export async function createBooking(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const listingSlug = formData.get("listingSlug") as string;
  const checkIn = formData.get("checkIn") as string;
  const checkOut = formData.get("checkOut") as string;
  const guests = Number(formData.get("guests"));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/listing/${listingSlug}`)}`);
  }

  const limit = await checkRateLimit(user.id, "create-booking", { max: 10, windowMinutes: 60 });
  if (!limit.allowed) return { error: rateLimitMessage("booking", limit) };

  if (!checkIn || !checkOut) {
    return { error: "Please choose check-in and check-out dates." };
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    return { error: "Check-out must be after check-in." };
  }

  // Re-fetch server-side — never trust a client-submitted price/total.
  const listing = await getListingBySlug(listingSlug);
  if (!listing) {
    return { error: "This listing is no longer available." };
  }
  if (guests < 1 || guests > listing.maxGuests) {
    return { error: `This listing sleeps up to ${listing.maxGuests} guests.` };
  }

  // Blocked dates (maintenance, owner stays) aren't in the bookings table,
  // so the exclusion constraint below can't catch them — checked separately.
  const { data: blocks } = await supabase
    .from("blocked_date_ranges")
    .select("start_date")
    .eq("listing_id", listing.id)
    .lt("start_date", checkOut)
    .gt("end_date", checkIn)
    .limit(1);
  if (blocks && blocks.length > 0) {
    return { error: "Those dates aren't available for this property. Please choose different dates." };
  }

  const subtotal = nights * listing.pricePerNight.amount;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + listing.cleaningFee.amount + serviceFee;

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      listing_id: listing.id,
      user_id: user.id,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      price_per_night_snapshot: listing.pricePerNight.amount,
      cleaning_fee_snapshot: listing.cleaningFee.amount,
      service_fee: serviceFee,
      total,
      status: "confirmed",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23P01") {
      return { error: "Those dates were just booked by someone else. Please choose different dates." };
    }
    return { error: "Something went wrong creating your reservation. Please try again." };
  }

  // Best-effort — a failed email should never block a successful booking.
  if (user.email) {
    try {
      const h = await headers();
      const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const resend = getResendClient();
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: bookingConfirmationSubject(listing.title),
        html: bookingConfirmationEmail({
          listingTitle: listing.title,
          listingImage: listing.images[0] ?? "",
          listingCity: listing.city,
          checkIn,
          checkOut,
          nights,
          guests,
          pricePerNight: listing.pricePerNight.amount,
          cleaningFee: listing.cleaningFee.amount,
          serviceFee,
          total,
          currency: listing.pricePerNight.currency,
          confirmationUrl: `${origin}/bookings/${booking.id}/confirmation`,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
    }
  }

  // Best-effort — lets an operator know a booking exists without having to
  // keep the dashboard open. Silently skipped if no address is configured.
  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    try {
      const h = await headers();
      const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const resend = getResendClient();
      await resend.emails.send({
        from: EMAIL_FROM,
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: adminNewBookingSubject(listing.title),
        html: adminNewBookingEmail({
          listingTitle: listing.title,
          guestName: user.user_metadata?.full_name ?? "Guest",
          guestEmail: user.email ?? "",
          checkIn,
          checkOut,
          guests,
          total,
          currency: listing.pricePerNight.currency,
          adminBookingUrl: `${origin}/admin/bookings/${booking.id}`,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send admin new-booking notification:", emailError);
    }
  }

  redirect(`/bookings/${booking.id}/confirmation`);
}

export async function cancelBooking(
  _prevState: CancelBookingResult | null,
  formData: FormData
): Promise<CancelBookingResult> {
  const bookingId = formData.get("bookingId") as string;
  if (!bookingId) return { error: "Missing booking." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/bookings");

  const { data: bookingRow } = await supabase
    .from("bookings")
    .select("id, status, check_in, check_out, listing:listings(title, city, images, cancellation_policy)")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .maybeSingle();

  const booking = bookingRow as unknown as
    | {
        id: string;
        status: BookingStatus;
        check_in: string;
        check_out: string;
        listing: { title: string; city: string; images: string[]; cancellation_policy: CancellationPolicy | null } | null;
      }
    | null;

  if (!booking) return { error: "Booking not found." };
  if (!canCancelBooking({ status: booking.status, checkIn: booking.check_in })) {
    return {
      error:
        booking.status === "cancelled"
          ? "This booking is already cancelled."
          : "This stay has already started and can no longer be cancelled.",
    };
  }

  const { refundPercent } = getCancellationTerms(booking.listing?.cancellation_policy ?? undefined, booking.check_in);

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", refund_percent: refundPercent })
    .eq("id", bookingId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Something went wrong cancelling your reservation. Please try again." };
  }

  // Best-effort — a failed email should never block a successful cancellation.
  const listing = booking.listing;
  if (user.email && listing) {
    try {
      const h = await headers();
      const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const resend = getResendClient();
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: bookingCancellationSubject(listing.title),
        html: bookingCancellationEmail({
          listingTitle: listing.title,
          listingImage: listing.images[0] ?? "",
          listingCity: listing.city,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          siteUrl: origin,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send booking cancellation email:", emailError);
    }
  }

  revalidatePath("/bookings");
  revalidatePath(`/bookings/${bookingId}/confirmation`);
  return { ok: true };
}
