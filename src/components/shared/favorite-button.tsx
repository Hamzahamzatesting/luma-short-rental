"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  className?: string;
  initial?: boolean;
}

/** Local-state only in Phase 1 — no persistence until accounts/Supabase land. */
export function FavoriteButton({ className, initial = false }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initial);

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorited((v) => !v);
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
