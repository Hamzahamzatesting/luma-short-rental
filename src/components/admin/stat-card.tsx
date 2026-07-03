import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  className?: string;
  emphasis?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
  emphasis,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 transition-colors duration-200 hover:ring-gold/30",
        emphasis &&
          "bg-gradient-to-br from-gold/[0.08] via-card to-card ring-gold/15",
        className,
      )}
    >
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 font-heading text-[1.75rem] leading-none font-medium text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  );
}
