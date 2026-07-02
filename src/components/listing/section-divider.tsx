import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
}

/** A quiet ornamental rule used to separate major blocks on the listing page. */
export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn("flex items-center gap-4", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" />
      <span className="size-1.5 rounded-full bg-gold/50" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border" />
    </div>
  );
}
