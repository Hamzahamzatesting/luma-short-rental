"use client";

import { useActionState, useMemo, useState } from "react";
import { Star, ShieldCheck, Zap, ReceiptText, Headset } from "lucide-react";
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

interface DateRange {
  start: string;
  end: string;
}

interface BookingCardProps {
  listing: Listing;
  bookedRanges?: DateRange[];
}

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Booking" },
  { icon: Zap, label: "Instant Confirmation" },
  { icon: ReceiptText, label: "No Hidden Fees" },
  { icon: Headset, label: "Premium Support" },
];

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/** Half-open interval overlap — mirrors the DB's `daterange(check_in, check_out, '[)')` exclusion constraint. */
function rangesOverlap(checkIn: string, checkOut: string, ranges: DateRange[]): boolean {
  return ranges.some((r) => checkIn < r.end && checkOut > r.start);
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export function BookingCard({ listing, bookedRanges = [] }: BookingCardProps) {
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

  // Catches the common case instantly, client-side, instead of only after
  // a round trip to the server — the database exclusion constraint is
  // still the real, final guard against a double-booking either way.
  const hasDateOverlap = Boolean(checkIn && checkOut && rangesOverlap(checkIn, checkOut, bookedRanges));

  return (
    <div className="rounded-3xl border border-gold/25 bg-card p-8 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.55)]">
      <div className="mb-7 flex items-end justify-between">
        <p className="flex items-baseline gap-1.5">
          <span className="font-serif text-4xl leading-none text-foreground">
            {listing.pricePerNight.amount.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">MAD / night</span>
        </p>
      </div>
      <div className="mb-7 flex items-center gap-1.5 text-sm text-foreground/90">
        <span className="flex text-gold">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(listing.rating) ? "fill-gold text-gold" : "text-gold/30"}
            />
          ))}
        </span>
        <span className="font-medium">{listing.rating.toFixed(1)}</span>
        <span className="text-muted-foreground">({listing.reviewCount} reviews)</span>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="listingSlug" value={listing.slug} />

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-border">
          <div className="flex flex-col gap-1 border-r border-border p-4">
            <label className="text-[0.65rem] font-medium uppercase tracking-label text-muted-foreground">
              Check-in
            </label>
            <Input
              type="date"
              name="checkIn"
              value={checkIn}
              min={todayStr()}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && checkOut <= e.target.value) setCheckOut("");
              }}
              required
              className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-col gap-1 p-4">
            <label className="text-[0.65rem] font-medium uppercase tracking-label text-muted-foreground">
              Check-out
            </label>
            <Input
              type="date"
              name="checkOut"
              value={checkOut}
              min={checkIn || todayStr()}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        {hasDateOverlap ? (
          <p className="text-xs text-destructive">
            Those dates aren&apos;t available for this property — please choose a different range.
          </p>
        ) : null}

        <div className="rounded-xl border border-border p-4">
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

        <Button
          type="submit"
          size="xl"
          disabled={pending || hasDateOverlap}
          className="mt-2 w-full transition-all duration-300 hover:shadow-[0_8px_24px_-6px_rgba(212,175,55,0.5)] hover:brightness-110 active:scale-[0.98]"
        >
          {pending ? "Reserving…" : "Reserve"}
        </Button>

        {state?.error && (
          <p className="text-center text-xs text-destructive">{state.error}</p>
        )}
      </form>

      {nights > 0 && (
        <div className="mt-7 flex flex-col gap-3 border-t border-border pt-7 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              Stay ({nights} night{nights > 1 ? "s" : ""})
            </span>
            <span>{subtotal.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Cleaning Fee</span>
            <span>{cleaningFee.toLocaleString()} MAD</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service Fee</span>
            <span>{serviceFee.toLocaleString()} MAD</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between border-t border-gold/20 pt-4">
            <span className="text-base font-medium text-foreground">Total</span>
            <span className="font-serif text-xl text-gold">{total.toLocaleString()} MAD</span>
          </div>
        </div>
      )}

      <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-border pt-6">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-[0.7rem] text-muted-foreground">
            <Icon size={13} strokeWidth={1.5} className="shrink-0 text-gold/70" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
