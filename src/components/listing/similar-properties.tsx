import { Section } from "@/components/layout/section";
import { PropertyCard } from "@/components/shared/property-card";
import { Reveal } from "@/components/motion/reveal";
import type { Listing } from "@/lib/data/types";

interface SimilarPropertiesProps {
  listings: Listing[];
}

export function SimilarProperties({ listings }: SimilarPropertiesProps) {
  if (listings.length === 0) return null;

  return (
    <Section variant="light" label="More to Discover">
      <Reveal>
        <h2 className="mb-10 max-w-xl font-serif text-3xl text-foreground">
          Similar Residences
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((listing, i) => (
          <Reveal key={listing.id} delay={Math.min(i * 0.08, 0.24)}>
            <PropertyCard listing={listing} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
