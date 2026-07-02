import { cn } from "@/lib/utils";

interface ArchwayMarkProps {
  className?: string;
  style?: React.CSSProperties;
}

/** The lit-archway-and-star symbol at the center of the LUMA identity. */
export function ArchwayMark({ className, style }: ArchwayMarkProps) {
  return (
    <svg
      viewBox="0 0 40 48"
      fill="none"
      className={cn("shrink-0", className)}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M8 44V20a12 12 0 0 1 24 0v24Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M20 21.2c.65 2.75 1.05 3.15 3.8 3.8-2.75.65-3.15 1.05-3.8 3.8-.65-2.75-1.05-3.15-3.8-3.8 2.75-.65 3.15-1.05 3.8-3.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
