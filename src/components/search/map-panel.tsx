"use client";

import { useState } from "react";
import Link from "next/link";
import type { Listing } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface MapPanelProps {
  listings: Listing[];
  className?: string;
}

// Illustrative only in Phase 1 — a real map SDK (Mapbox/Google Maps) is a
// self-contained follow-up that only touches this component.
const BOUNDS = { minLat: 29.8, maxLat: 36.2, minLng: -10.2, maxLng: -4.8 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = 100 - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.min(96, Math.max(4, x)), y: Math.min(96, Math.max(4, y)) };
}

export function MapPanel({ listings, className }: MapPanelProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative h-full min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-navy",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(250,241,242,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,241,242,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <p className="absolute left-4 top-4 rounded-full bg-midnight/70 px-3 py-1 text-[0.65rem] uppercase tracking-label text-ivory/70 backdrop-blur-sm">
        Illustrative map &middot; live map coming soon
      </p>

      {listings.map((listing) => {
        const { x, y } = project(listing.location.lat, listing.location.lng);
        const isActive = activeId === listing.id;
        return (
          <Link
            key={listing.id}
            href={`/listing/${listing.slug}`}
            onMouseEnter={() => setActiveId(listing.id)}
            onMouseLeave={() => setActiveId(null)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-xs font-medium shadow-md transition-all",
              isActive
                ? "z-10 scale-110 border-gold bg-gold text-midnight"
                : "border-ivory/20 bg-midnight text-ivory hover:border-gold/60"
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {listing.pricePerNight.amount.toLocaleString()}
          </Link>
        );
      })}
    </div>
  );
}
