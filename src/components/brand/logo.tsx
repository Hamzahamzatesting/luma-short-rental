import { cn } from "@/lib/utils";
import { ArchwayMark } from "./archway-mark";

export type LogoVariant = "primary" | "reversed" | "on-navy" | "badge";

interface LogoProps {
  variant?: LogoVariant;
  /** Rendered height in px. Below 24, only the symbol is shown per brand guidelines. */
  height?: number;
  symbolOnly?: boolean;
  className?: string;
}

const TONE: Record<Exclude<LogoVariant, "badge">, { icon: string; word: string }> = {
  primary: { icon: "text-gold", word: "text-ivory" },
  reversed: { icon: "text-midnight", word: "text-midnight" },
  "on-navy": { icon: "text-gold", word: "text-ivory" },
};

export function Logo({ variant = "primary", height = 36, symbolOnly = false, className }: LogoProps) {
  if (variant === "badge") {
    const size = height * 1.9;
    return (
      <div
        className={cn(
          "inline-flex flex-col items-center justify-center rounded-full border border-gold/70 text-gold",
          className
        )}
        style={{ width: size, height: size }}
      >
        <ArchwayMark style={{ height: height * 0.48, width: height * 0.4 }} />
        <span className="mt-1 font-serif tracking-[0.3em]" style={{ fontSize: height * 0.16 }}>
          LUMA
        </span>
      </div>
    );
  }

  const tone = TONE[variant];
  const showWordmark = !symbolOnly && height >= 24;

  return (
    <div
      className={cn("inline-flex items-center", className)}
      style={{ gap: height * 0.22, padding: height * 0.18 }}
    >
      <ArchwayMark className={tone.icon} style={{ height, width: height * (40 / 48) }} />
      {showWordmark && (
        <span
          className={cn("font-serif leading-none tracking-[0.26em]", tone.word)}
          style={{ fontSize: height * 0.5 }}
        >
          LUMA
        </span>
      )}
    </div>
  );
}
