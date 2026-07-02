import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapListingRow, type ListingRow } from "@/lib/data/listings";
import type { Listing, ListingStatus, Money } from "@/lib/data/types";

export interface AdminListingSummary {
  id: string;
  slug: string;
  title: string;
  city: string;
  destinationName: string;
  status: ListingStatus;
  isFeatured: boolean;
  isInstantBook: boolean;
  pricePerNight: Money;
  rating: number;
  reviewCount: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  createdAt: string;
}

interface AdminListingSummaryRow {
  id: string;
  slug: string;
  title: string;
  city: string;
  status: ListingStatus;
  is_featured: boolean;
  is_instant_book: boolean;
  price_amount: number;
  price_currency: string;
  rating: number;
  review_count: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  created_at: string;
  destination: { name: string } | null;
}

const SUMMARY_SELECT =
  "id, slug, title, city, status, is_featured, is_instant_book, price_amount, price_currency, rating, review_count, images, bedrooms, bathrooms, max_guests, created_at, destination:destinations(name)";

export interface AdminListingFilters {
  status?: ListingStatus;
  query?: string;
}

export async function getAllListingsAdmin(
  filters: AdminListingFilters = {}
): Promise<AdminListingSummary[]> {
  const supabase = createAdminClient();
  let query = supabase.from("listings").select(SUMMARY_SELECT);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.query) {
    query = query.or(`title.ilike.%${filters.query}%,city.ilike.%${filters.query}%`);
  }

  const { data } = await query.order("created_at", { ascending: false });

  return ((data ?? []) as unknown as AdminListingSummaryRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    city: row.city,
    destinationName: row.destination?.name ?? row.city,
    status: row.status,
    isFeatured: row.is_featured,
    isInstantBook: row.is_instant_book,
    pricePerNight: { amount: row.price_amount, currency: row.price_currency as Money["currency"] },
    rating: row.rating,
    reviewCount: row.review_count,
    image: row.images?.[0] ?? "",
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    maxGuests: row.max_guests,
    createdAt: row.created_at,
  }));
}

export async function getListingByIdAdmin(id: string): Promise<Listing | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
  return data ? mapListingRow(data as ListingRow) : null;
}
