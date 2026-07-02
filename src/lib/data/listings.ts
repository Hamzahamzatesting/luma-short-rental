import "server-only";
import { listingsMock } from "./mock/listings.mock";
import { destinationsMock } from "./mock/destinations.mock";
import type { Listing, SearchFilters } from "./types";

function matchesFilters(listing: Listing, filters: SearchFilters): boolean {
  if (filters.destinationSlug) {
    const destination = destinationsMock.find((d) => d.slug === filters.destinationSlug);
    if (!destination || listing.destinationId !== destination.id) return false;
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    const haystack = `${listing.title} ${listing.city} ${listing.neighborhood ?? ""}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (filters.guests && listing.maxGuests < filters.guests) return false;
  if (filters.bedrooms && listing.bedrooms < filters.bedrooms) return false;
  if (filters.bathrooms && listing.bathrooms < filters.bathrooms) return false;
  if (filters.minPrice && listing.pricePerNight.amount < filters.minPrice) return false;
  if (filters.maxPrice && listing.pricePerNight.amount > filters.maxPrice) return false;
  if (filters.petFriendly && !listing.isPetFriendly) return false;
  if (filters.seaView && !listing.hasSeaView) return false;
  if (filters.instantBookOnly && !listing.isInstantBook) return false;
  if (filters.amenityIds?.length) {
    const hasAll = filters.amenityIds.every((id) => listing.amenityIds.includes(id));
    if (!hasAll) return false;
  }
  return true;
}

function sortListings(listings: Listing[], sort: SearchFilters["sort"]): Listing[] {
  const sorted = [...listings];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.pricePerNight.amount - b.pricePerNight.amount);
    case "price-desc":
      return sorted.sort((a, b) => b.pricePerNight.amount - a.pricePerNight.amount);
    case "popularity":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "luxury":
      return sorted.sort((a, b) => b.luxuryScore - a.luxuryScore);
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    default:
      return sorted;
  }
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  return listingsMock.filter((l) => l.isFeatured).slice(0, limit);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  return listingsMock.find((l) => l.slug === slug) ?? null;
}

export async function searchListings(filters: SearchFilters = {}): Promise<Listing[]> {
  const filtered = listingsMock.filter((l) => matchesFilters(l, filters));
  return sortListings(filtered, filters.sort ?? "newest");
}

export async function getSimilarListings(listingId: string, limit = 4): Promise<Listing[]> {
  const listing = listingsMock.find((l) => l.id === listingId);
  if (!listing) return [];
  return listingsMock
    .filter((l) => l.id !== listingId && l.destinationId === listing.destinationId)
    .slice(0, limit);
}

export async function getAllListingSlugs(): Promise<string[]> {
  return listingsMock.map((l) => l.slug);
}
