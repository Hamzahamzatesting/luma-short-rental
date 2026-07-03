import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapListingRow, type ListingRow } from "./listings";
import type { Listing } from "./types";

/** Filtered explicitly by the current user as defense-in-depth on top of RLS. */
export async function getFavoriteListings(): Promise<Listing[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favorites")
    .select("listing:listings(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return ((data ?? []) as unknown as { listing: ListingRow | null }[])
    .map((row) => row.listing)
    .filter((l): l is ListingRow => l !== null)
    .map(mapListingRow);
}
