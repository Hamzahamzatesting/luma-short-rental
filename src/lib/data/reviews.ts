import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Review } from "./types";

export interface ReviewRow {
  id: string;
  listing_id: string;
  author_name: string;
  author_avatar_url: string | null;
  rating: number;
  comment: string;
  date: string;
  status: Review["status"];
  is_featured: boolean;
}

export function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    listingId: row.listing_id,
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url ?? undefined,
    rating: row.rating,
    comment: row.comment,
    date: row.date,
    status: row.status,
    isFeatured: row.is_featured,
  };
}

export async function getReviewsForListing(listingId: string): Promise<Review[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("listing_id", listingId)
    .eq("status", "approved")
    .order("date", { ascending: false });
  return (data ?? []).map(mapReviewRow);
}

/** Booking IDs the current user has already left a review for, so "leave a review" only shows once. */
export async function getReviewedBookingIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase.from("reviews").select("booking_id").eq("user_id", user.id);
  return new Set((data ?? []).map((r) => r.booking_id as string).filter(Boolean));
}
