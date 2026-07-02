import Link from "next/link";
import { Section } from "@/components/layout/section";
import { PropertyCard } from "@/components/shared/property-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import type { Listing } from "@/lib/data/types";

interface FeaturedPropertiesProps {
  listings: Listing[];
}

export function FeaturedProperties({ listings }: FeaturedPropertiesProps) {
  return (
    <Section variant="dark" label="Handpicked">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <h2 className="max-w-xl font-serif text-3xl text-foreground md:text-4xl">
            Featured Residences
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Button
            render={<Link href="/search">View All Stays</Link>}
            nativeButton={false}
            variant="gold-outline"
            size="lg"
          />
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing, i) => (
          <Reveal key={listing.id} delay={Math.min(i * 0.08, 0.32)}>
            <PropertyCard listing={listing} priority={i < 3} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
