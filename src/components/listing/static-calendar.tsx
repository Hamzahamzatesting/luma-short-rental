"use client";

import { Calendar } from "@/components/ui/calendar";

interface StaticCalendarProps {
  blockedDates: string[];
}

/** Visual availability preview only — real availability/booking logic lands with Supabase in Phase 2. */
export function StaticCalendar({ blockedDates }: StaticCalendarProps) {
  const disabledDates = blockedDates.map((d) => new Date(d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <Calendar
        numberOfMonths={2}
        disabled={[{ before: today }, ...disabledDates]}
        className="rounded-lg border border-border"
      />
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="size-2.5 rounded-sm bg-muted" />
        Unavailable
      </div>
    </div>
  );
}
