"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canReviewBooking } from "@/lib/data/bookings";
import type { BookingStatus } from "@/lib/data/types";

export type SubmitReviewState = { error: string } | { ok: true } | undefined;

const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().trim().min(10, "Please write at least a few words about your stay."),
});

export async function submitReview(
  _prevState: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const parsed = reviewSchema.safeParse({
    bookingId: formData.get("bookingId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your review." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to leave a review." };

  const { data: bookingRow } = await supabase
    .from("bookings")
    .select("id, listing_id, status, check_out")
    .eq("id", parsed.data.bookingId)
    .eq("user_id", user.id)
    .maybeSingle();

  const booking = bookingRow as { id: string; listing_id: string; status: BookingStatus; check_out: string } | null;
  if (!booking) return { error: "Booking not found." };
  if (!canReviewBooking({ status: booking.status, checkOut: booking.check_out })) {
    return { error: "This stay isn't eligible for a review yet." };
  }

  const { error } = await supabase.from("reviews").insert({
    listing_id: booking.listing_id,
    user_id: user.id,
    booking_id: booking.id,
    author_name: user.user_metadata?.full_name ?? "Guest",
    author_avatar_url: user.user_metadata?.avatar_url ?? null,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    date: new Date().toISOString(),
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You've already reviewed this stay." };
    }
    return { error: "Something went wrong submitting your review. Please try again." };
  }

  revalidatePath("/bookings");
  return { ok: true };
}
