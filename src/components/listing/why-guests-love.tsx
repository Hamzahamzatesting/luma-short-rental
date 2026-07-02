import { Sparkle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

interface WhyGuestsLoveProps {
  title: string;
  bullets: string[];
}

export function WhyGuestsLove({ title, bullets }: WhyGuestsLoveProps) {
  if (bullets.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-card/60 to-card/20 p-8 md:p-10">
      <p className="label-eyebrow mb-2">The Experience</p>
      <h2 className="mb-7 font-serif text-2xl text-foreground">Why Guests Love {title}</h2>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        {bullets.map((bullet, i) => (
          <Reveal key={bullet} delay={Math.min(i * 0.06, 0.3)}>
            <li className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85">
              <Sparkle size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
              {bullet}
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
