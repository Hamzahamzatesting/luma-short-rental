import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Users, Zap } from "lucide-react";
import type { Listing } from "@/lib/data/types";
import { RatingStars } from "./rating-stars";
import { PriceTag } from "./price-tag";
import { FavoriteButton } from "./favorite-button";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  listing: Listing;
  className?: string;
  priority?: boolean;
  layout?: "grid" | "list";
}

export function PropertyCard({ listing, className, priority = false, layout = "grid" }: PropertyCardProps) {
  const isList = layout === "list";

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className={cn(
        "group/card block overflow-hidden rounded-lg border border-border/60 bg-card transition-transform duration-300 ease-out hover:-translate-y-1",
        isList && "flex flex-col sm:flex-row",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden",
          isList && "sm:aspect-[4/3] sm:w-72 sm:shrink-0"
        )}
      >
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
        />
        <FavoriteButton className="absolute right-3 top-3" />
        {listing.isInstantBook && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-midnight/60 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-label text-ivory backdrop-blur-sm">
            <Zap size={11} className="text-gold" />
            Instant Book
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs uppercase tracking-label text-muted-foreground">
            {listing.city}
          </p>
          <RatingStars
            rating={listing.rating}
            reviewCount={listing.reviewCount}
            className="shrink-0 whitespace-nowrap"
          />
        </div>

        <h3 className="font-serif text-lg leading-snug text-foreground">{listing.title}</h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users size={13} /> {listing.maxGuests}
          </span>
          <span className="inline-flex items-center gap-1">
            <BedDouble size={13} /> {listing.bedrooms}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath size={13} /> {listing.bathrooms}
          </span>
        </div>

        <div className="mt-auto pt-2">
          <PriceTag price={listing.pricePerNight} className="text-base text-gold" />
        </div>
      </div>
    </Link>
  );
}
