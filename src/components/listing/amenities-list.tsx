import { getAmenityById } from "@/lib/data/amenities";
import { getIcon } from "@/lib/icon-map";

interface AmenitiesListProps {
  amenityIds: string[];
}

export function AmenitiesList({ amenityIds }: AmenitiesListProps) {
  const amenities = amenityIds.map(getAmenityById).filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {amenities.map((amenity) => {
        const Icon = getIcon(amenity.icon);
        return (
          <div key={amenity.id} className="flex items-center gap-3 text-sm text-foreground">
            <Icon size={17} strokeWidth={1.5} className="text-gold" />
            {amenity.label}
          </div>
        );
      })}
    </div>
  );
}
