import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Booking, BookingStatus } from "./types";

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
  created_at: string;
  updated_at: string;
  listing: {
    slug: string;
    title: string;
    images: string[];
    city: string;
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const BOOKING_SELECT =
  "*, listing:listings(slug, title, images, city)";

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
