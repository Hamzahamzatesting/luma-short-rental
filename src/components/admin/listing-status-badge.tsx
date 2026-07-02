import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ListingStatus } from "@/lib/data/types";

const STATUS_STYLE: Record<ListingStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  archived: "bg-destructive/10 text-destructive",
};

export function ListingStatusBadge({ status, className }: { status: ListingStatus; className?: string }) {
  return (
    <Badge variant="ghost" className={cn("uppercase tracking-wide", STATUS_STYLE[status], className)}>
      {status}
    </Badge>
  );
}
