"use client";

import dynamic from "next/dynamic";
import type { Listing } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface MapPanelProps {
  listings: Listing[];
  className?: string;
}

// Leaflet touches `window` on import, so it can only run in the browser —
// dynamic + ssr:false keeps it out of the server render entirely.
const LiveMapInner = dynamic(
  () => import("./live-map-inner").then((m) => m.LiveMapInner),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(250,241,242,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,241,242,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    ),
  }
);

export function MapPanel({ listings, className }: MapPanelProps) {
  return (
    <div
      className={cn(
        "relative h-full min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-navy",
        className
      )}
    >
      <LiveMapInner listings={listings} />
    </div>
  );
}
