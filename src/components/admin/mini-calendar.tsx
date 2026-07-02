import { eachDayOfInterval, endOfMonth, format, getDay, isSameMonth, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/lib/data/admin/dashboard";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/** Dashboard's "Calendar Overview" widget — a read-only month grid of check-in/out density. Not the full availability manager. */
export function MiniCalendar({ month, year, days }: { month: number; year: number; days: CalendarDay[] }) {
  const monthStart = startOfMonth(new Date(year, month, 1));
  const monthEnd = endOfMonth(monthStart);
  const cells = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = getDay(monthStart);
  const byDate = new Map(days.map((d) => [d.date, d]));

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
          const isToday = isSameMonth(date, new Date()) && date.getDate() === new Date().getDate();
          return (
            <div
              key={key}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md text-xs",
                isToday ? "ring-1 ring-gold" : ""
              )}
            >
              <span className="text-foreground">{date.getDate()}</span>
              {day && (day.checkIns > 0 || day.checkOuts > 0) ? (
                <span className="mt-0.5 flex gap-0.5">
                  {day.checkIns > 0 ? <span className="size-1 rounded-full bg-emerald-500" title={`${day.checkIns} check-ins`} /> : null}
                  {day.checkOuts > 0 ? <span className="size-1 rounded-full bg-blue-500" title={`${day.checkOuts} check-outs`} /> : null}
                </span>
              ) : null}
            </div>
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
