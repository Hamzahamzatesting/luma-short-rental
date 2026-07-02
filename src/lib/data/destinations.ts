import "server-only";
import { destinationsMock } from "./mock/destinations.mock";
import type { Destination } from "./types";

export async function getDestinations(): Promise<Destination[]> {
  return destinationsMock;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  return destinationsMock.find((d) => d.slug === slug) ?? null;
}
