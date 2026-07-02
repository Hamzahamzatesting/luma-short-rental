"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Destination } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface SearchWidgetProps {
  destinations: Destination[];
  className?: string;
}

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10];

export function SearchWidget({ destinations, className }: SearchWidgetProps) {
  const router = useRouter();
  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<string>("2");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "grid w-full grid-cols-1 items-end gap-4 rounded-lg border border-ivory/15 bg-midnight/60 p-4 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr_auto] lg:gap-0 lg:divide-x lg:divide-ivory/15 lg:p-2",
        className
      )}
    >
      <div className="flex flex-col gap-1.5 px-3 py-1.5">
        <label className="text-[0.65rem] font-medium uppercase tracking-label text-ivory/60">
          Location
        </label>
        <Select value={destination} onValueChange={(value) => setDestination(value ?? "")}>
          <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-sm text-ivory shadow-none focus-visible:ring-0 [&>svg]:text-ivory/50">
            <SelectValue placeholder="Anywhere in Morocco" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((d) => (
              <SelectItem key={d.slug} value={d.slug}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 px-3 py-1.5">
        <label className="text-[0.65rem] font-medium uppercase tracking-label text-ivory/60">
          Check-in
        </label>
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="h-auto border-0 bg-transparent p-0 text-sm text-ivory shadow-none focus-visible:ring-0 [color-scheme:dark]"
        />
      </div>

      <div className="flex flex-col gap-1.5 px-3 py-1.5">
        <label className="text-[0.65rem] font-medium uppercase tracking-label text-ivory/60">
          Check-out
        </label>
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="h-auto border-0 bg-transparent p-0 text-sm text-ivory shadow-none focus-visible:ring-0 [color-scheme:dark]"
        />
      </div>

      <div className="flex flex-col gap-1.5 px-3 py-1.5">
        <label className="text-[0.65rem] font-medium uppercase tracking-label text-ivory/60">
          Guests
        </label>
        <Select value={guests} onValueChange={(value) => setGuests(value ?? "2")}>
          <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-sm text-ivory shadow-none focus-visible:ring-0 [&>svg]:text-ivory/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GUEST_OPTIONS.map((g) => (
              <SelectItem key={g} value={String(g)}>
                {g} guest{g > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="px-1.5 py-1.5 lg:pl-3">
        <Button type="submit" size="xl" className="w-full gap-2">
          <Search size={16} />
          Explore Stays
        </Button>
      </div>
    </form>
  );
}
