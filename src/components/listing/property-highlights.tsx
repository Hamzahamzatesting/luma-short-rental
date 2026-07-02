import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { Highlight } from "@/lib/listing-editorial";

interface PropertyHighlightsProps {
  highlights: Highlight[];
}

export function PropertyHighlights({ highlights }: PropertyHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {highlights.map((highlight, i) => (
        <Reveal key={highlight.label} delay={Math.min(i * 0.05, 0.25)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-xs uppercase tracking-label text-foreground/90 transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10">
            <Check size={13} strokeWidth={2} className="text-gold" />
            {highlight.label}
          </span>
        </Reveal>
      ))}
    </div>
  );
}
