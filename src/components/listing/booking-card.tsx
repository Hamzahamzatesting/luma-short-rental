"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createBooking } from "@/lib/actions/bookings";
import type { Listing } from "@/lib/data/types";

interface BookingCardProps {
  listing: Listing;
}

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function BookingCard({ listing }: BookingCardProps) {
  const [state, formAction, pending] = useActionState(createBooking, undefined);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  // Local math is a live preview only — the Server Action recomputes
  // everything from a fresh DB fetch before it ever touches the database.
  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = useMemo(() => nights * listing.pricePerNight.amount, [nights, listing]);
  const cleaningFee = nights > 0 ? listing.cleaningFee.amount : 0;
  const serviceFee = nights > 0 ? Math.round(subtotal * 0.08) : 0;
  const total = subtotal + cleaningFee + serviceFee;

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-baseline justify-between">
        <p className="font-serif text-2xl text-foreground">
          {listing.pricePerNight.amount.toLocaleString()}{" "}
          <span className="text-sm font-sans text-muted-foreground">MAD / night</span>
        </p>
        <p className="text-sm text-muted-foreground">★ {listing.rating.toFixed(2)}</p>
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="listingSlug" value={listing.slug} />

        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border">
          <div className="flex flex-col gap-1 border-r border-border p-3">
            <label className="text-[0.65rem] font-medium uppercase tracking-label text-muted-foreground">
              Check-in
            </label>
            <Input
              type="date"
              name="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-col gap-1 p-3">
            <label className="text-[0.65rem] font-medium uppercase tracking-label text-muted-foreground">
              Check-out
            </label>
            <Input
              type="date"
              name="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border p-3">
          <label className="text-[0.65rem] font-medium uppercase tracking-label text-muted-foreground">
            Guests
          </label>
          <Select value={guests} onValueChange={(v) => setGuests(v ?? "2")}>
            <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map((g) => (
                <SelectItem key={g} value={String(g)}>
                  {g} guest{g > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="guests" value={guests} />
        </div>

        <Button type="submit" size="xl" disabled={pending} className="mt-2 w-full">
          {pending ? "Reserving…" : "Reserve"}
        </Button>

        {state?.error && (
          <p className="text-center text-xs text-destructive">{state.error}</p>
        )}
      </form>

      {nights > 0 && (
        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              {listing.pricePerNight.amount.toLocaleString()} MAD &times; {nights} night
              {nights > 1 ? "s" : ""}
            </span>
            <span>{subtotal.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Cleaning fee</span>
            <span>{cleaningFee.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service fee</span>
            <span>{serviceFee.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-medium text-foreground">
            <span>Total</span>
            <span>{total.toLocaleString()} MAD</span>
          </div>
        </div>
      )}
    </div>
  );
}
