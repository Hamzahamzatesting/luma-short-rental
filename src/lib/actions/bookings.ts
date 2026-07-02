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
import type { BookingStatus } from "@/lib/data/types";

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
    .select("id, status, check_in, check_out, listing:listings(title, city, images)")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .maybeSingle();

  const booking = bookingRow as unknown as
    | {
        id: string;
        status: BookingStatus;
        check_in: string;
        check_out: string;
        listing: { title: string; city: string; images: string[] } | null;
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

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
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
