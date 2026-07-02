import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/lib/data/types";

interface ReviewsSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ReviewsSection({ reviews, rating, reviewCount }: ReviewsSectionProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Star size={18} className="fill-gold text-gold" />
        <p className="font-serif text-xl text-foreground">
          {rating.toFixed(2)} &middot; {reviewCount} review{reviewCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {review.authorAvatarUrl && (
                <div className="relative size-9 overflow-hidden rounded-full">
                  <Image src={review.authorAvatarUrl} alt={review.authorName} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{review.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
