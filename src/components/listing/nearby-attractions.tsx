import { MapPin } from "lucide-react";
import type { NearbyAttraction } from "@/lib/data/types";

interface NearbyAttractionsProps {
  attractions: NearbyAttraction[];
}

export function NearbyAttractions({ attractions }: NearbyAttractionsProps) {
  return (
    <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {attractions.map((a) => (
        <li key={a.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
          <div className="flex items-center gap-3">
            <MapPin size={15} className="text-gold" />
            <div>
              <p className="text-foreground">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.category}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{a.distanceKm} km</p>
        </li>
      ))}
    </ul>
  );
}
