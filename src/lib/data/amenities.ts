import { AMENITIES } from "@/lib/constants";
import type { Amenity } from "./types";

export async function getAmenities(): Promise<Amenity[]> {
  return AMENITIES as unknown as Amenity[];
}

export function getAmenityById(id: string): Amenity | undefined {
  return (AMENITIES as unknown as Amenity[]).find((a) => a.id === id);
}
