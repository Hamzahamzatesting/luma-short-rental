import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Booking, BookingStatus, CancellationPolicy } from "./types";

interface BookingRow {
  id: string;
  listing_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  price_per_night_snapshot: number;
  cleaning_fee_snapshot: number;
  service_fee: number;
  total: number;
  status: BookingStatus;
  refund_percent: number | null;
  created_at: string;
  updated_at: string;
  listing: {
    slug: string;
    title: string;
    images: string[];
    city: string;
    cancellation_policy: CancellationPolicy | null;
  } | null;
}

function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingSlug: row.listing?.slug ?? "",
    listingTitle: row.listing?.title ?? "Listing",
    listingImage: row.listing?.images?.[0] ?? "",
    listingCity: row.listing?.city ?? "",
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    nights: row.nights,
    pricePerNightSnapshot: { amount: row.price_per_night_snapshot, currency: "MAD" },
    cleaningFeeSnapshot: { amount: row.cleaning_fee_snapshot, currency: "MAD" },
    serviceFee: { amount: row.service_fee, currency: "MAD" },
    total: { amount: row.total, currency: "MAD" },
    status: row.status,
    refundPercent: row.refund_percent ?? undefined,
    listingCancellationPolicy: row.listing?.cancellation_policy ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const BOOKING_SELECT =
  "*, listing:listings(slug, title, images, city, cancellation_policy)";

/** Filtered explicitly by the current user as defense-in-depth on top of RLS. */
export async function getBookingsForUser(): Promise<Booking[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => mapBookingRow(row as unknown as BookingRow));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  return data ? mapBookingRow(data as unknown as BookingRow) : null;
}

/** Mirrors the "users cancel own bookings" RLS policy in 0007_booking_cancellation.sql. */
export function canCancelBooking(booking: Pick<Booking, "status" | "checkIn">): boolean {
  if (booking.status === "cancelled") return false;
  const todayStr = new Date().toISOString().slice(0, 10);
  return booking.checkIn > todayStr;
}

/**
 * Nothing here automatically transitions a booking to "checked_out" or
 * "completed" on a schedule — that only happens if an admin sets it by
 * hand — so eligibility is date-based instead: any non-cancelled,
 * non-refunded stay whose checkout date has already passed.
 */
export function canReviewBooking(booking: Pick<Booking, "status" | "checkOut">): boolean {
  if (booking.status === "cancelled" || booking.status === "refunded") return false;
  const todayStr = new Date().toISOString().slice(0, 10);
  return booking.checkOut <= todayStr;
}
