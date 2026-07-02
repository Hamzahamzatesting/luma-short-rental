import { cn } from "@/lib/utils";

interface ArchwayPatternProps {
  className?: string;
  id?: string;
}

/** Repeating archway-and-star motif in gold, used sparingly as a decorative divider/background. */
export function ArchwayPattern({ className, id = "luma-archway-pattern" }: ArchwayPatternProps) {
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden="true">
      <defs>
        <pattern id={id} width="64" height="72" patternUnits="userSpaceOnUse">
          <path
            d="M20 56V36a8 8 0 0 1 16 0v20Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M28 34.8c.45 1.9.7 2.15 2.6 2.6-1.9.45-2.15.7-2.6 2.6-.45-1.9-.7-2.15-2.6-2.6 1.9-.45 2.15-.7 2.6-2.6Z"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
