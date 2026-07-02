import Image from "next/image";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { RatingStars } from "@/components/shared/rating-stars";
import type { Testimonial } from "@/lib/data/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <Section variant="light" label="Guest Voices">
      <Reveal>
        <h2 className="max-w-xl font-serif text-3xl text-foreground md:text-4xl">
          What Our Guests Say
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.slice(0, 6).map((t, i) => (
          <Reveal key={t.id} delay={Math.min(i * 0.07, 0.28)}>
            <figure className="flex h-full flex-col gap-4 rounded-lg border border-border/60 bg-card p-6">
              <RatingStars rating={t.rating} />
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-2">
                {t.avatarUrl && (
                  <div className="relative size-9 overflow-hidden rounded-full">
                    <Image src={t.avatarUrl} alt={t.authorName} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{t.authorName}</p>
                  {t.authorLocation && (
                    <p className="text-xs text-muted-foreground">{t.authorLocation}</p>
                  )}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
