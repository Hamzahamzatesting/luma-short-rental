"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { AMENITIES } from "@/lib/constants";

const MAX_PRICE = 8000;

const STEP_OPTIONS = [1, 2, 3, 4, 5, 6];

export function FiltersSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice") ?? 0),
    Number(searchParams.get("maxPrice") ?? MAX_PRICE),
  ]);
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "");
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") ?? "");
  const [amenityIds, setAmenityIds] = useState<string[]>(
    searchParams.get("amenities")?.split(",").filter(Boolean) ?? []
  );
  const [instantBookOnly, setInstantBookOnly] = useState(
    searchParams.get("instantBookOnly") === "true"
  );
  const [petFriendly, setPetFriendly] = useState(searchParams.get("petFriendly") === "true");
  const [seaView, setSeaView] = useState(searchParams.get("seaView") === "true");

  function toggleAmenity(id: string) {
    setAmenityIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    else params.delete("minPrice");

    if (priceRange[1] < MAX_PRICE) params.set("maxPrice", String(priceRange[1]));
    else params.delete("maxPrice");

    if (bedrooms) params.set("bedrooms", bedrooms);
    else params.delete("bedrooms");

    if (bathrooms) params.set("bathrooms", bathrooms);
    else params.delete("bathrooms");

    if (amenityIds.length) params.set("amenities", amenityIds.join(","));
    else params.delete("amenities");

    if (instantBookOnly) params.set("instantBookOnly", "true");
    else params.delete("instantBookOnly");

    if (petFriendly) params.set("petFriendly", "true");
    else params.delete("petFriendly");

    if (seaView) params.set("seaView", "true");
    else params.delete("seaView");
    router.push(`/search?${params.toString()}`);
    setOpen(false);
  }

  function resetFilters() {
    setPriceRange([0, MAX_PRICE]);
    setBedrooms("");
    setBathrooms("");
    setAmenityIds([]);
    setInstantBookOnly(false);
    setPetFriendly(false);
    setSeaView(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-sm text-foreground hover:bg-muted"
      >
        <SlidersHorizontal size={15} />
        Filters
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-8 px-6 pb-6">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-label text-muted-foreground">
              Price per night (MAD)
            </p>
            <Slider
              min={0}
              max={MAX_PRICE}
              step={100}
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
            />
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>{priceRange[0].toLocaleString()} MAD</span>
              <span>{priceRange[1].toLocaleString()} MAD</span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-label text-muted-foreground">
              Bedrooms
            </p>
            <div className="flex flex-wrap gap-2">
              {STEP_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBedrooms(bedrooms === String(n) ? "" : String(n))}
                  className={`flex size-9 items-center justify-center rounded-full border text-sm transition-colors ${
                    bedrooms === String(n)
                      ? "border-gold bg-gold text-midnight"
                      : "border-border text-foreground hover:border-gold/60"
                  }`}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-label text-muted-foreground">
              Bathrooms
            </p>
            <div className="flex flex-wrap gap-2">
              {STEP_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBathrooms(bathrooms === String(n) ? "" : String(n))}
                  className={`flex size-9 items-center justify-center rounded-full border text-sm transition-colors ${
                    bathrooms === String(n)
                      ? "border-gold bg-gold text-midnight"
                      : "border-border text-foreground hover:border-gold/60"
                  }`}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-label text-muted-foreground">
              Amenities
            </p>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((a) => (
                <label key={a.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={amenityIds.includes(a.id)}
                    onCheckedChange={() => toggleAmenity(a.id)}
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-label text-muted-foreground">
              More
            </p>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={instantBookOnly}
                onCheckedChange={(v) => setInstantBookOnly(v === true)}
              />
              Instant Book only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={petFriendly} onCheckedChange={(v) => setPetFriendly(v === true)} />
              Pet Friendly
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={seaView} onCheckedChange={(v) => setSeaView(v === true)} />
              Sea View
            </label>
          </div>
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-border">
          <Button variant="ghost" className="flex-1" onClick={resetFilters}>
            Reset
          </Button>
          <Button className="flex-1" onClick={applyFilters}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
