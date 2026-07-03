import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Review, ReviewStatus } from "@/lib/data/types";

export interface AdminReview extends Review {
  listingTitle: string;
  listingSlug: string;
}

interface AdminReviewRow {
  id: string;
  listing_id: string;
  author_name: string;
  author_avatar_url: string | null;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
  is_featured: boolean;
  listing: { title: string; slug: string } | null;
}

export async function getAllReviewsAdmin(status?: ReviewStatus): Promise<AdminReview[]> {
  const supabase = createAdminClient();
  let query = supabase.from("reviews").select("*, listing:listings(title, slug)");
  if (status) query = query.eq("status", status);

  const { data } = await query.order("date", { ascending: false });

  return ((data ?? []) as unknown as AdminReviewRow[]).map((row) => ({
    id: row.id,
    listingId: row.listing_id,
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url ?? undefined,
    rating: row.rating,
    comment: row.comment,
    date: row.date,
    status: row.status,
    isFeatured: row.is_featured,
    listingTitle: row.listing?.title ?? "Listing",
    listingSlug: row.listing?.slug ?? "",
  }));
}
