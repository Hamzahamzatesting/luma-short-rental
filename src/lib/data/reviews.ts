import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Review } from "./types";

interface ReviewRow {
  id: string;
  listing_id: string;
  author_name: string;
  author_avatar_url: string | null;
  rating: number;
  comment: string;
  date: string;
}

function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    listingId: row.listing_id,
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url ?? undefined,
    rating: row.rating,
    comment: row.comment,
    date: row.date,
  };
}

export async function getReviewsForListing(listingId: string): Promise<Review[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("listing_id", listingId)
    .order("date", { ascending: false });
  return (data ?? []).map(mapReviewRow);
}
