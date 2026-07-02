import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { getDestinationBySlug } from "./destinations";
import type { Listing, NearbyAttraction, SearchFilters, SortOption } from "./types";

export interface ListingRow {
  id: string;
  slug: string;
  title: string;
  destination_id: string;
  city: string;
  country: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
  images: string[];
  videos: string[];
  price_amount: number;
  price_currency: string;
  weekend_price_amount: number | null;
  weekend_price_currency: string | null;
  cleaning_fee_amount: number;
  cleaning_fee_currency: string;
  security_deposit_amount: number | null;
  security_deposit_currency: string | null;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
  amenity_ids: string[];
  luxury_score: number;
  is_instant_book: boolean;
  is_featured: boolean;
  is_pet_friendly: boolean;
  has_pool: boolean;
  has_wifi: boolean;
  has_parking: boolean;
  has_sea_view: boolean;
  short_description: string;
  description: string;
  house_rules: string[];
  check_in_time: string;
  check_out_time: string;
  host_id: string;
  rating: number;
  review_count: number;
  nearby_attractions: NearbyAttraction[];
  status: Listing["status"];
  cancellation_policy: Listing["cancellationPolicy"] | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export function mapListingRow(row: ListingRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    destinationId: row.destination_id,
    city: row.city,
    country: row.country,
    neighborhood: row.neighborhood ?? undefined,
    location: { lat: row.lat, lng: row.lng },
    images: row.images,
    videos: row.videos ?? [],
    pricePerNight: { amount: row.price_amount, currency: row.price_currency as Listing["pricePerNight"]["currency"] },
    weekendPricePerNight:
      row.weekend_price_amount != null && row.weekend_price_currency
        ? { amount: row.weekend_price_amount, currency: row.weekend_price_currency as Listing["pricePerNight"]["currency"] }
        : undefined,
    cleaningFee: { amount: row.cleaning_fee_amount, currency: row.cleaning_fee_currency as Listing["pricePerNight"]["currency"] },
    securityDeposit:
      row.security_deposit_amount != null && row.security_deposit_currency
        ? { amount: row.security_deposit_amount, currency: row.security_deposit_currency as Listing["pricePerNight"]["currency"] }
        : undefined,
    maxGuests: row.max_guests,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    squareMeters: row.square_meters,
    amenityIds: row.amenity_ids,
    luxuryScore: row.luxury_score,
    isInstantBook: row.is_instant_book,
    isFeatured: row.is_featured,
    isPetFriendly: row.is_pet_friendly,
    hasPool: row.has_pool,
    hasWifi: row.has_wifi,
    hasParking: row.has_parking,
    hasSeaView: row.has_sea_view,
    shortDescription: row.short_description,
    description: row.description,
    houseRules: row.house_rules,
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
    hostId: row.host_id,
    rating: row.rating,
    reviewCount: row.review_count,
    nearbyAttractions: row.nearby_attractions,
    status: row.status,
    cancellationPolicy: row.cancellation_policy ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySort(query: any, sort: SortOption) {
  switch (sort) {
    case "price-asc":
      return query.order("price_amount", { ascending: true });
    case "price-desc":
      return query.order("price_amount", { ascending: false });
    case "popularity":
      return query.order("review_count", { ascending: false });
    case "luxury":
      return query.order("luxury_score", { ascending: false });
    case "newest":
    default:
      return query.order("created_at", { ascending: false });
  }
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .limit(limit);
  return (data ?? []).map(mapListingRow);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? mapListingRow(data) : null;
}

export async function searchListings(filters: SearchFilters = {}): Promise<Listing[]> {
  const supabase = createPublicClient();
  let query = supabase.from("listings").select("*").eq("status", "published");

  if (filters.destinationSlug) {
    const destination = await getDestinationBySlug(filters.destinationSlug);
    if (!destination) return [];
    query = query.eq("destination_id", destination.id);
  }
  if (filters.query) {
    query = query.or(`title.ilike.%${filters.query}%,city.ilike.%${filters.query}%`);
  }
  if (filters.guests) query = query.gte("max_guests", filters.guests);
  if (filters.bedrooms) query = query.gte("bedrooms", filters.bedrooms);
  if (filters.bathrooms) query = query.gte("bathrooms", filters.bathrooms);
  if (filters.minPrice) query = query.gte("price_amount", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price_amount", filters.maxPrice);
  if (filters.petFriendly) query = query.eq("is_pet_friendly", true);
  if (filters.seaView) query = query.eq("has_sea_view", true);
  if (filters.instantBookOnly) query = query.eq("is_instant_book", true);
  if (filters.amenityIds?.length) query = query.contains("amenity_ids", filters.amenityIds);

  query = applySort(query, filters.sort ?? "newest");

  const { data } = await query;
  let listings = (data ?? []).map(mapListingRow);

  if (filters.checkIn && filters.checkOut) {
    const { data: overlapping } = await supabase
      .from("booked_date_ranges")
      .select("listing_id")
      .lt("check_in", filters.checkOut)
      .gt("check_out", filters.checkIn);
    const blockedIds = new Set((overlapping ?? []).map((b) => b.listing_id as string));
    listings = listings.filter((l) => !blockedIds.has(l.id));
  }

  return listings;
}

export async function getSimilarListings(listingId: string, limit = 4): Promise<Listing[]> {
  const supabase = createPublicClient();
  const { data: current } = await supabase
    .from("listings")
    .select("destination_id")
    .eq("id", listingId)
    .maybeSingle();
  if (!current) return [];

  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("destination_id", current.destination_id)
    .eq("status", "published")
    .neq("id", listingId)
    .limit(limit);
  return (data ?? []).map(mapListingRow);
}

export async function getAllListingSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("listings").select("slug").eq("status", "published");
  return (data ?? []).map((l) => l.slug as string);
}

/** Booked (non-cancelled) date ranges for a listing, used to disable dates in StaticCalendar. */
export async function getBookedDateRangesForListing(
  listingId: string
): Promise<{ start: string; end: string }[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("booked_date_ranges")
    .select("check_in, check_out")
    .eq("listing_id", listingId);
  return (data ?? []).map((b) => ({ start: b.check_in as string, end: b.check_out as string }));
}
