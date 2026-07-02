"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getListingBySlug } from "@/lib/data/listings";

export type BookingFormState = { error?: string } | undefined;

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

  redirect(`/bookings/${booking.id}/confirmation`);
}
