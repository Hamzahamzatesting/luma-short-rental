import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  className?: string;
  size?: number;
}

export function RatingStars({ rating, reviewCount, className, size = 14 }: RatingStarsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <Star size={size} className="fill-gold text-gold" />
      <span className="font-medium">{rating.toFixed(2)}</span>
      {typeof reviewCount === "number" && (
        <span className="text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
