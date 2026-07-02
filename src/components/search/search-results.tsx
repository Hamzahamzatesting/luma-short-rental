"use client";

import { useState } from "react";
import { LayoutGrid, List, Map as MapIcon } from "lucide-react";
import { PropertyCard } from "@/components/shared/property-card";
import { MapPanel } from "./map-panel";
import { FiltersSidebar } from "./filters-sidebar";
import { SortBar } from "./sort-bar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Listing } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  listings: Listing[];
}

type View = "grid" | "list";

export function SearchResults({ listings }: SearchResultsProps) {
  const [view, setView] = useState<View>("grid");
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FiltersSidebar />
          <p className="text-sm text-muted-foreground">
            {listings.length} {listings.length === 1 ? "residence" : "residences"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SortBar />
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <List size={15} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-sm text-foreground hover:bg-muted lg:hidden"
          >
            <MapIcon size={15} />
            Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        <div
          className={cn(
            "grid gap-8",
            view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          )}
        >
          {listings.length === 0 ? (
            <p className="col-span-full py-16 text-center text-muted-foreground">
              No residences match your filters yet. Try widening your search.
            </p>
          ) : (
            listings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} layout={view} />
            ))
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-28">
            <MapPanel listings={listings} className="h-[calc(100vh-9rem)]" />
          </div>
        </div>
      </div>

      <Sheet open={mapOpen} onOpenChange={setMapOpen}>
        <SheetContent side="bottom" className="h-[80vh] w-full sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Map</SheetTitle>
          </SheetHeader>
          <div className="flex-1 px-6 pb-6">
            <MapPanel listings={listings} className="h-full" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
