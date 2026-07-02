import { getAmenityById } from "@/lib/data/amenities";
import { getIcon } from "@/lib/icon-map";
import { Reveal } from "@/components/motion/reveal";

interface AmenitiesListProps {
  amenityIds: string[];
}

// Presentational-only polish — the underlying amenity `label` in the data
// layer stays plain; this just gives the premium card a warmer phrase.
const PREMIUM_LABEL: Record<string, string> = {
  wifi: "High-Speed WiFi",
  kitchen: "Fully Equipped Kitchen",
  parking: "Secure Parking",
  concierge: "Concierge Service",
  pool: "Private Pool",
};

export function AmenitiesList({ amenityIds }: AmenitiesListProps) {
  const amenities = amenityIds.map(getAmenityById).filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {amenities.map((amenity, i) => {
        const Icon = getIcon(amenity.icon);
        return (
          <Reveal key={amenity.id} delay={Math.min(i * 0.04, 0.2)}>
            <div className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-xl border border-border bg-card/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card hover:shadow-[0_12px_32px_-12px_rgba(212,175,55,0.25)]">
              <span className="flex size-11 items-center justify-center rounded-full border border-gold/25 bg-gold/5 transition-colors duration-300 group-hover:border-gold/50 group-hover:bg-gold/10">
                <Icon size={19} strokeWidth={1.25} className="text-gold" />
              </span>
              <p className="text-sm text-foreground">
                {PREMIUM_LABEL[amenity.id] ?? amenity.label}
              </p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
