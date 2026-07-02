import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/data/types";

const HAPPY_PATH: { status: BookingStatus; label: string }[] = [
  { status: "pending", label: "Requested" },
  { status: "confirmed", label: "Confirmed" },
  { status: "checked_in", label: "Checked in" },
  { status: "checked_out", label: "Checked out" },
  { status: "completed", label: "Completed" },
];

const TERMINAL_STATUSES: BookingStatus[] = ["cancelled", "refunded"];

/**
 * Bookings only store their *current* status, not a transition history, so
 * this renders the canonical happy-path with everything up to the current
 * status marked done — an approximation, not an audit log.
 */
export function BookingTimeline({ status }: { status: BookingStatus }) {
  if (TERMINAL_STATUSES.includes(status)) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <span className="flex size-5 items-center justify-center rounded-full bg-destructive/10">
          <CheckIcon className="size-3" />
        </span>
        This reservation was {status}.
      </div>
    );
  }

  const currentIndex = HAPPY_PATH.findIndex((step) => step.status === status);

  return (
    <ol className="flex flex-col gap-3">
      {HAPPY_PATH.map((step, index) => {
        const done = index <= currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.status} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                done ? "border-gold bg-gold/15 text-gold" : "border-border text-muted-foreground"
              )}
            >
              {done ? <CheckIcon className="size-3" /> : index + 1}
            </span>
            <span className={cn("text-sm", active ? "font-medium text-foreground" : "text-muted-foreground")}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
