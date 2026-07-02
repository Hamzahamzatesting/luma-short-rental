import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { Destination } from "@/lib/data/types";

interface DestinationsProps {
  destinations: Destination[];
}

export function Destinations({ destinations }: DestinationsProps) {
  return (
    <Section variant="dark" label="Where to Stay" id="destinations">
      <Reveal>
        <h2 className="max-w-xl font-serif text-3xl text-foreground md:text-4xl">
          Destinations
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {destinations.map((destination, i) => (
          <Reveal key={destination.id} delay={Math.min(i * 0.06, 0.3)}>
            <Link
              href={`/search?destination=${destination.slug}`}
              className="group/dest relative block aspect-[3/4] overflow-hidden rounded-lg"
            >
              <Image
                src={destination.imageUrl}
                alt={destination.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover/dest:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-serif text-lg text-ivory">{destination.name}</h3>
                <p className="text-xs text-ivory/70">{destination.listingCount} residences</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
