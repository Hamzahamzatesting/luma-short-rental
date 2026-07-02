import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/data/types";

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  awaiting_payment: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  confirmed: "bg-gold/15 text-gold",
  checked_in: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  checked_out: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  cancelled: "bg-destructive/10 text-destructive",
  refunded: "bg-destructive/10 text-destructive",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  awaiting_payment: "Awaiting payment",
  confirmed: "Confirmed",
  checked_in: "Checked in",
  checked_out: "Checked out",
  cancelled: "Cancelled",
  refunded: "Refunded",
  completed: "Completed",
};

export function BookingStatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <Badge variant="ghost" className={cn("uppercase tracking-wide", STATUS_STYLE[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
