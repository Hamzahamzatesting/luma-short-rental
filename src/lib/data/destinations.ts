import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Destination } from "./types";

interface DestinationRow {
  id: string;
  slug: string;
  name: string;
  country: string;
  image_url: string;
  listing_count: number;
  blurb: string | null;
}

function mapDestinationRow(row: DestinationRow): Destination {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    country: row.country,
    imageUrl: row.image_url,
    listingCount: row.listing_count,
    blurb: row.blurb ?? undefined,
  };
}

export async function getDestinations(): Promise<Destination[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("destinations").select("*").order("name");
  return (data ?? []).map(mapDestinationRow);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ? mapDestinationRow(data) : null;
}
