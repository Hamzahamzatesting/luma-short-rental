"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "./favorites-provider";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
}

export function FavoriteButton({ listingId, className }: FavoriteButtonProps) {
  const { favoriteIds, toggle } = useFavorites();
  const favorited = favoriteIds.has(listingId);

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(listingId);
      }}
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-midnight/40 backdrop-blur-sm transition-colors hover:bg-midnight/60",
        className
      )}
    >
      <Heart
        size={16}
        className={cn(
          "transition-colors",
          favorited ? "fill-gold text-gold" : "fill-transparent text-ivory"
        )}
      />
    </button>
  );
}
