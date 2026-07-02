"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookedRange {
  start: string;
  end: string;
}

interface LuxuryCalendarProps {
  bookedRanges: BookedRange[];
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function buildMonthGrid(month: Date) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

function MonthGrid({
  month,
  today,
  ranges,
}: {
  month: Date;
  today: Date;
  ranges: { start: Date; end: Date }[];
}) {
  const days = useMemo(() => buildMonthGrid(month), [month]);

  return (
    <div className="flex-1">
      <p className="mb-5 text-center font-serif text-base text-foreground">
        {format(month, "MMMM yyyy")}
      </p>
      <div className="mb-2 grid grid-cols-7">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="flex h-7 items-center justify-center text-[0.65rem] uppercase tracking-label text-muted-foreground"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const isPast = isBefore(day, today) && !isSameDay(day, today);
          const isBooked = ranges.some((r) => isWithinInterval(day, r));
          const disabled = isPast || isBooked;
          const isCurrentDay = isToday(day);

          return (
            <div key={day.toISOString()} className="flex items-center justify-center py-0.5">
              {inMonth ? (
                <span
                  className={cn(
                    "relative flex size-9 items-center justify-center rounded-full text-sm transition-all duration-200",
                    isCurrentDay && "bg-gold font-medium text-midnight shadow-[0_0_0_4px_rgba(212,175,55,0.15)]",
                    !isCurrentDay && !disabled && "text-foreground/90 hover:bg-gold/10 hover:text-gold",
                    disabled && !isCurrentDay && "text-muted-foreground/30 line-through"
                  )}
                >
                  {format(day, "d")}
                </span>
              ) : (
                <span className="size-9" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Bespoke availability preview, sourced from real bookings (Supabase). Display-only — actual dates are chosen in the booking card. */
export function LuxuryCalendar({ bookedRanges }: LuxuryCalendarProps) {
  const [offset, setOffset] = useState(0);
  const today = startOfDay(new Date());
  const baseMonth = useMemo(() => addMonths(startOfMonth(today), offset), [offset, today]);
  const nextMonth = useMemo(() => addMonths(baseMonth, 1), [baseMonth]);

  const ranges = useMemo(
    () =>
      bookedRanges.map(({ start, end }) => {
        const inclusiveEnd = new Date(end);
        inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
        return { start: new Date(start), end: inclusiveEnd };
      }),
    [bookedRanges]
  );

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-8">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-xs uppercase tracking-label text-muted-foreground">Availability</p>
        <button
          type="button"
          onClick={() => setOffset((o) => Math.min(11, o + 1))}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
        <MonthGrid month={baseMonth} today={today} ranges={ranges} />
        <div className="hidden flex-1 md:block">
          <MonthGrid month={nextMonth} today={today} ranges={ranges} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 border-t border-border pt-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-gold" />
          Today
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-muted-foreground/20" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
