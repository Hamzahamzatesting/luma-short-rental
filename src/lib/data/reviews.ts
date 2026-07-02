import "server-only";
import { reviewsMock } from "./mock/reviews.mock";
import type { Review } from "./types";

export async function getReviewsForListing(listingId: string): Promise<Review[]> {
  return reviewsMock
    .filter((r) => r.listingId === listingId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
