import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type BlockReason = "maintenance" | "owner_stay" | "other";

export interface AvailabilityBlock {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  reason: BlockReason;
  notes?: string;
  createdAt: string;
}

interface AvailabilityBlockRow {
  id: string;
  listing_id: string;
  start_date: string;
  end_date: string;
  reason: BlockReason;
  notes: string | null;
  created_at: string;
}

function mapRow(row: AvailabilityBlockRow): AvailabilityBlock {
  return {
    id: row.id,
    listingId: row.listing_id,
    startDate: row.start_date,
    endDate: row.end_date,
    reason: row.reason,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getAvailabilityBlocksForListing(listingId: string): Promise<AvailabilityBlock[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("availability_blocks")
    .select("*")
    .eq("listing_id", listingId)
    .order("start_date", { ascending: true });
  return (data ?? []).map(mapRow);
}
