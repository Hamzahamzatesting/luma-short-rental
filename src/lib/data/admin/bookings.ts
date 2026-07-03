import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Booking, BookingStatus, Money } from "@/lib/data/types";

export interface AdminBookingSummary {
  id: string;
  listingId: string;
  listingSlug: string;
  listingTitle: string;
  listingImage: string;
  guestId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: Money;
  status: BookingStatus;
  createdAt: string;
}

interface AdminBookingRow {
  id: string;
  listing_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  price_per_night_snapshot: number;
  cleaning_fee_snapshot: number;
  service_fee: number;
  total: number;
  status: BookingStatus;
  admin_notes: string | null;
  refund_percent: number | null;
  created_at: string;
  updated_at: string;
  listing: { slug: string; title: string; images: string[] } | null;
}

const ADMIN_BOOKING_SELECT = "*, listing:listings(slug, title, images)";

/**
 * bookings.user_id references auth.users, not profiles — profiles.id is
 * only *coincidentally* the same value (set by the signup trigger), so
 * PostgREST can't embed `profiles` from `bookings` via a foreign-key
 * join. Batch-fetch names separately instead.
 */
export async function getProfileNames(userIds: string[]): Promise<Map<string, string>> {
  if (userIds.length === 0) return new Map();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", Array.from(new Set(userIds)));
  return new Map((data ?? []).map((p) => [p.id as string, (p.full_name as string | null) ?? "Guest"]));
}

export interface AdminBookingFilters {
  status?: BookingStatus;
  limit?: number;
  orderBy?: "check_in" | "created_at";
}

export async function getAllBookingsAdmin(
  filters: AdminBookingFilters = {}
): Promise<AdminBookingSummary[]> {
  const supabase = createAdminClient();
  let query = supabase.from("bookings").select(ADMIN_BOOKING_SELECT);
  if (filters.status) query = query.eq("status", filters.status);

  query = query.order(filters.orderBy ?? "check_in", { ascending: false });
  if (filters.limit) query = query.limit(filters.limit);

  const { data } = await query;
  const rows = (data ?? []) as unknown as AdminBookingRow[];
  const names = await getProfileNames(rows.map((r) => r.user_id));

  return rows.map((row) => ({
    id: row.id,
    listingId: row.listing_id,
    listingSlug: row.listing?.slug ?? "",
    listingTitle: row.listing?.title ?? "Listing",
    listingImage: row.listing?.images?.[0] ?? "",
    guestId: row.user_id,
    guestName: names.get(row.user_id) ?? "Guest",
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    nights: row.nights,
    total: { amount: row.total, currency: "MAD" },
    status: row.status,
    createdAt: row.created_at,
  }));
}

export interface AdminBookingDetail extends Booking {
  guestId: string;
  guestName: string;
  guestEmail?: string;
}

export async function getBookingByIdAdmin(id: string): Promise<AdminBookingDetail | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select(ADMIN_BOOKING_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;
  const row = data as unknown as AdminBookingRow;

  const [{ data: authUser }, names] = await Promise.all([
    supabase.auth.admin.getUserById(row.user_id),
    getProfileNames([row.user_id]),
  ]);
  const guestEmail = authUser?.user?.email;

  return {
    id: row.id,
    listingId: row.listing_id,
    listingSlug: row.listing?.slug ?? "",
    listingTitle: row.listing?.title ?? "Listing",
    listingImage: row.listing?.images?.[0] ?? "",
    listingCity: "",
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    nights: row.nights,
    pricePerNightSnapshot: { amount: row.price_per_night_snapshot, currency: "MAD" },
    cleaningFeeSnapshot: { amount: row.cleaning_fee_snapshot, currency: "MAD" },
    serviceFee: { amount: row.service_fee, currency: "MAD" },
    total: { amount: row.total, currency: "MAD" },
    status: row.status,
    adminNotes: row.admin_notes ?? undefined,
    refundPercent: row.refund_percent ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    guestId: row.user_id,
    guestName: names.get(row.user_id) ?? "Guest",
    guestEmail,
  };
}
