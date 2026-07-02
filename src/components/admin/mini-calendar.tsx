"use client";

import Link from "next/link";
import { eachDayOfInterval, endOfMonth, format, getDay, isSameMonth, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CalendarDay } from "@/lib/data/admin/dashboard";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/** Dashboard's "Calendar Overview" widget — click a day to see its check-ins/check-outs. Not the full availability manager. */
export function MiniCalendar({ month, year, days }: { month: number; year: number; days: CalendarDay[] }) {
  const monthStart = startOfMonth(new Date(year, month, 1));
  const monthEnd = endOfMonth(monthStart);
  const cells = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = getDay(monthStart);
  const byDate = new Map(days.map((d) => [d.date, d]));
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-foreground">{format(monthStart, "MMMM yyyy")}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="pb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {w}
          </div>
        ))}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {cells.map((date) => {
          const key = format(date, "yyyy-MM-dd");
          const day = byDate.get(key);
          const hasEvents = !!day && day.events.length > 0;
          const isToday = isSameMonth(date, new Date()) && key === today;

          const cell = (
            <div
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md text-xs transition-colors",
                isToday ? "ring-1 ring-gold" : "",
                hasEvents ? "cursor-pointer hover:bg-muted" : ""
              )}
            >
              <span className="text-foreground">{date.getDate()}</span>
              {hasEvents ? (
                <span className="mt-0.5 flex gap-0.5">
                  {day!.checkIns > 0 ? <span className="size-1 rounded-full bg-emerald-500" /> : null}
                  {day!.checkOuts > 0 ? <span className="size-1 rounded-full bg-blue-500" /> : null}
                </span>
              ) : null}
            </div>
          );

          if (!hasEvents) return <div key={key}>{cell}</div>;

          return (
            <Popover key={key}>
              <PopoverTrigger render={<button type="button" />}>{cell}</PopoverTrigger>
              <PopoverContent className="w-64">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {format(date, "EEEE, MMMM d")}
                </p>
                <div className="flex flex-col divide-y divide-border">
                  {day!.events.map((event, i) => (
                    <Link
                      key={`${event.bookingId}-${event.kind}-${i}`}
                      href={`/admin/bookings/${event.bookingId}`}
                      className="flex items-center justify-between gap-2 py-1.5 text-sm first:pt-0 last:pb-0 hover:text-gold"
                    >
                      <span className="min-w-0 truncate">
                        {event.listingTitle} &middot; {event.guestName}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-[10px] tracking-wide uppercase",
                          event.kind === "check-in" ? "text-emerald-500" : "text-blue-500"
                        )}
                      >
                        {event.kind === "check-in" ? "In" : "Out"}
                      </span>
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" /> Check-ins
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-blue-500" /> Check-outs
        </span>
      </div>
    </div>
  );
}
