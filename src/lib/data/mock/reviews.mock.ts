import type { Review } from "../types";
import { listingsMock } from "./listings.mock";
import { avatarFor } from "./images";

const REVIEWERS: { name: string; gender: "men" | "women" }[] = [
  { name: "Charlotte Reed", gender: "women" },
  { name: "Marcus Lindqvist", gender: "men" },
  { name: "Amira Haddad", gender: "women" },
  { name: "Thomas Berger", gender: "men" },
  { name: "Isabelle Laurent", gender: "women" },
  { name: "Daniel Osei", gender: "men" },
  { name: "Nour Benali", gender: "women" },
  { name: "James Whitfield", gender: "men" },
];

const COMMENT_TEMPLATES = [
  "Every detail felt considered — the kind of stay you remember long after checking out.",
  "Quietly luxurious, exactly as promised. The concierge team anticipated everything we needed.",
  "Beautiful light, beautiful design, and remarkably peaceful given how central it is.",
  "We've stayed at a lot of properties through other platforms — this was in a different league.",
  "The photos don't do it justice. Arriving felt like stepping into a different pace of life.",
  "Impeccably kept, thoughtfully furnished, and the host was warm without being intrusive.",
  "A rare find — private, elegant, and genuinely restful. We're already planning to return.",
  "The rooftop at sunset alone was worth the trip. Flawless from booking to departure.",
];

function reviewDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString();
}

export const reviewsMock: Review[] = listingsMock.flatMap((listing, listingIndex) => {
  const count = 3 + (listingIndex % 3); // 3-5 reviews per listing
  return Array.from({ length: count }, (_, i) => {
    const reviewerIndex = (listingIndex * 2 + i) % REVIEWERS.length;
    const reviewer = REVIEWERS[reviewerIndex];
    const commentIndex = (listingIndex + i * 3) % COMMENT_TEMPLATES.length;
    return {
      id: `review-${listing.id}-${i + 1}`,
      listingId: listing.id,
      authorName: reviewer.name,
      authorAvatarUrl: avatarFor(reviewer.gender, listingIndex * 7 + i + 1),
      rating: 4.5 + ((listingIndex + i) % 6) * 0.1,
      comment: COMMENT_TEMPLATES[commentIndex],
      date: reviewDate(20 + listingIndex * 4 + i * 15),
      status: "approved",
      isFeatured: false,
    } satisfies Review;
  });
});
