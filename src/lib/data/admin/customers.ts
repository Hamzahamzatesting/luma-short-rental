import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfileNames } from "./bookings";
import type { Money, BookingStatus } from "@/lib/data/types";

const NON_REVENUE_STATUSES = ["cancelled", "refunded"];

export interface AdminCustomerSummary {
  id: string;
  name: string;
  email: string;
  stayCount: number;
  totalSpent: Money;
  lastBookingAt: string;
}

interface BookingAggRow {
  user_id: string;
  total: number;
  status: string;
  created_at: string;
}

export async function getAllCustomersAdmin(query?: string): Promise<AdminCustomerSummary[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("user_id, total, status, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as BookingAggRow[];
  const byGuest = new Map<string, { stayCount: number; totalSpent: number; lastBookingAt: string }>();
  for (const row of rows) {
    const existing = byGuest.get(row.user_id);
    const isRevenue = !NON_REVENUE_STATUSES.includes(row.status);
    if (existing) {
      existing.stayCount += 1;
      if (isRevenue) existing.totalSpent += Number(row.total);
    } else {
      byGuest.set(row.user_id, {
        stayCount: 1,
        totalSpent: isRevenue ? Number(row.total) : 0,
        lastBookingAt: row.created_at,
      });
    }
  }

  const userIds = Array.from(byGuest.keys());
  const [names, { data: usersPage }] = await Promise.all([
    getProfileNames(userIds),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);
  const emailById = new Map((usersPage?.users ?? []).map((u) => [u.id, u.email ?? ""]));

  let result: AdminCustomerSummary[] = userIds.map((id) => {
    const agg = byGuest.get(id)!;
    return {
      id,
      name: names.get(id) ?? "Guest",
      email: emailById.get(id) ?? "",
      stayCount: agg.stayCount,
      totalSpent: { amount: agg.totalSpent, currency: "MAD" },
      lastBookingAt: agg.lastBookingAt,
    };
  });

  if (query) {
    const q = query.toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }

  return result.sort((a, b) => b.lastBookingAt.localeCompare(a.lastBookingAt));
}

export interface AdminCustomerBooking {
  id: string;
  listingTitle: string;
  listingSlug: string;
  checkIn: string;
  checkOut: string;
  total: Money;
  status: BookingStatus;
  createdAt: string;
}

export interface AdminCustomerDetail {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  bookings: AdminCustomerBooking[];
}

export async function getCustomerDetailAdmin(id: string): Promise<AdminCustomerDetail | null> {
  const supabase = createAdminClient();
  const [{ data: authUser }, names, { data: bookingRows }] = await Promise.all([
    supabase.auth.admin.getUserById(id),
    getProfileNames([id]),
    supabase
      .from("bookings")
      .select("id, check_in, check_out, total, status, created_at, listing:listings(title, slug)")
      .eq("user_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!authUser?.user) return null;

  const bookings = ((bookingRows ?? []) as unknown as Array<{
    id: string;
    check_in: string;
    check_out: string;
    total: number;
    status: BookingStatus;
    created_at: string;
    listing: { title: string; slug: string } | null;
  }>).map((row) => ({
    id: row.id,
    listingTitle: row.listing?.title ?? "Listing",
    listingSlug: row.listing?.slug ?? "",
    checkIn: row.check_in,
    checkOut: row.check_out,
    total: { amount: row.total, currency: "MAD" as const },
    status: row.status,
    createdAt: row.created_at,
  }));

  return {
    id,
    name: names.get(id) ?? "Guest",
    email: authUser.user.email ?? "",
    joinedAt: authUser.user.created_at,
    bookings,
  };
}
