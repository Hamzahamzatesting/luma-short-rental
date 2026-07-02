"use client";

import { Calendar } from "@/components/ui/calendar";

interface BookedRange {
  start: string;
  end: string;
}

interface StaticCalendarProps {
  bookedRanges: BookedRange[];
}

/** Visual availability preview, sourced from real bookings (Supabase). */
export function StaticCalendar({ bookedRanges }: StaticCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // check_out is exclusive (the '[)' stay_range convention), so the
  // checkout day itself is bookable by the next guest — subtract one day.
  const disabledRanges = bookedRanges.map(({ start, end }) => {
    const to = new Date(end);
    to.setDate(to.getDate() - 1);
    return { from: new Date(start), to };
  });

  return (
    <div>
      <Calendar
        numberOfMonths={2}
        disabled={[{ before: today }, ...disabledRanges]}
        className="rounded-lg border border-border"
      />
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="size-2.5 rounded-sm bg-muted" />
        Unavailable
      </div>
    </div>
  );
}
