import "server-only";
import {
  endOfMonth,
  format,
  getDaysInMonth,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllBookingsAdmin, getProfileNames, type AdminBookingSummary } from "./bookings";
import type { Money } from "@/lib/data/types";

const NON_REVENUE_STATUSES = ["cancelled", "refunded"] as const;
const ACTIVE_RESERVATION_STATUSES = ["confirmed", "checked_in", "checked_out", "completed"];
const PENDING_RESERVATION_STATUSES = ["pending", "awaiting_payment"];

async function sumRevenueSince(iso: string): Promise<number> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("total")
    .gte("created_at", iso)
    .not("status", "in", `(${NON_REVENUE_STATUSES.join(",")})`);
  return (data ?? []).reduce((sum, row) => sum + Number(row.total), 0);
}

async function countListings(status?: "draft" | "published") {
  const supabase = createAdminClient();
  let query = supabase.from("listings").select("*", { count: "exact", head: true });
  if (status) query = query.eq("status", status);
  const { count } = await query;
  return count ?? 0;
}

async function countBookingsByStatuses(statuses: string[]) {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .in("status", statuses);
  return count ?? 0;
}

async function getUpcoming(field: "check_in" | "check_out", days = 7): Promise<AdminBookingSummary[]> {
  const supabase = createAdminClient();
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");
  const until = format(new Date(Date.now() + days * 86400000), "yyyy-MM-dd");

  const { data } = await supabase
    .from("bookings")
    .select("*, listing:listings(slug, title, images)")
    .gte(field, today)
    .lte(field, until)
    .not("status", "in", "(cancelled,refunded)")
    .order(field, { ascending: true })
    .limit(10);

  const rows = (data ?? []) as unknown as Array<{
    id: string;
    listing_id: string;
    user_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    nights: number;
    total: number;
    status: AdminBookingSummary["status"];
    created_at: string;
    listing: { slug: string; title: string; images: string[] } | null;
  }>;
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
    total: { amount: row.total, currency: "MAD" } as Money,
    status: row.status,
    createdAt: row.created_at,
  }));
}

async function getOccupancyRate(): Promise<number> {
  const supabase = createAdminClient();
  const now = new Date();
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");

  const [publishedCount, { data: monthBookings }] = await Promise.all([
    countListings("published"),
    supabase
      .from("bookings")
      .select("nights")
      .gte("check_in", monthStart)
      .lte("check_in", monthEnd)
      .not("status", "in", "(cancelled,refunded)"),
  ]);

  if (publishedCount === 0) return 0;

  // Approximation: nights counted against the month a stay *starts* in,
  // not clipped to stays that span a month boundary — good enough for an
  // overview tile, not for billing.
  const bookedNights = (monthBookings ?? []).reduce((sum, row) => sum + Number(row.nights), 0);
  const availableNights = publishedCount * getDaysInMonth(now);
  return Math.min(100, Math.round((bookedNights / availableNights) * 1000) / 10);
}

export interface RecentCustomer {
  id: string;
  name: string;
  stayCount: number;
  totalSpent: Money;
  lastBookingAt: string;
}

async function getRecentCustomers(limit = 5): Promise<RecentCustomer[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("user_id, total, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = (data ?? []) as unknown as Array<{
    user_id: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  const names = await getProfileNames(rows.map((r) => r.user_id));

  const byGuest = new Map<string, RecentCustomer>();
  for (const row of rows) {
    const existing = byGuest.get(row.user_id);
    const isRevenue = !NON_REVENUE_STATUSES.includes(row.status as (typeof NON_REVENUE_STATUSES)[number]);
    if (existing) {
      existing.stayCount += 1;
      if (isRevenue) existing.totalSpent.amount += Number(row.total);
    } else {
      byGuest.set(row.user_id, {
        id: row.user_id,
        name: names.get(row.user_id) ?? "Guest",
        stayCount: 1,
        totalSpent: { amount: isRevenue ? Number(row.total) : 0, currency: "MAD" },
        lastBookingAt: row.created_at,
      });
    }
  }

  return Array.from(byGuest.values()).slice(0, limit);
}

export interface RecentReview {
  id: string;
  listingTitle: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

async function getRecentReviews(limit = 5): Promise<RecentReview[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, author_name, rating, comment, date, listing:listings(title)")
    .order("date", { ascending: false })
    .limit(limit);

  return ((data ?? []) as unknown as Array<{
    id: string;
    author_name: string;
    rating: number;
    comment: string;
    date: string;
    listing: { title: string } | null;
  }>).map((row) => ({
    id: row.id,
    listingTitle: row.listing?.title ?? "Listing",
    authorName: row.author_name,
    rating: row.rating,
    comment: row.comment,
    date: row.date,
  }));
}

export interface CalendarEvent {
  bookingId: string;
  listingTitle: string;
  guestName: string;
  kind: "check-in" | "check-out";
}

export interface CalendarDay {
  date: string;
  checkIns: number;
  checkOuts: number;
  events: CalendarEvent[];
}

/** Backs the dashboard's compact, clickable "Calendar Overview" widget. */
export async function getCalendarOverview(month: number, year: number): Promise<CalendarDay[]> {
  const supabase = createAdminClient();
  const start = new Date(year, month, 1);
  const end = endOfMonth(start);
  const startIso = format(start, "yyyy-MM-dd");
  const endIso = format(end, "yyyy-MM-dd");

  const EVENT_SELECT = "id, user_id, check_in, check_out, listing:listings(title)";
  const [{ data: checkIns }, { data: checkOuts }] = await Promise.all([
    supabase
      .from("bookings")
      .select(EVENT_SELECT)
      .gte("check_in", startIso)
      .lte("check_in", endIso)
      .not("status", "in", "(cancelled,refunded)"),
    supabase
      .from("bookings")
      .select(EVENT_SELECT)
      .gte("check_out", startIso)
      .lte("check_out", endIso)
      .not("status", "in", "(cancelled,refunded)"),
  ]);

  type EventRow = {
    id: string;
    user_id: string;
    check_in: string;
    check_out: string;
    listing: { title: string } | null;
  };
  const allRows = [...((checkIns ?? []) as unknown as EventRow[]), ...((checkOuts ?? []) as unknown as EventRow[])];
  const names = await getProfileNames(allRows.map((r) => r.user_id));

  const byDate = new Map<string, CalendarDay>();
  for (const row of (checkIns ?? []) as unknown as EventRow[]) {
    const key = row.check_in;
    const day = byDate.get(key) ?? { date: key, checkIns: 0, checkOuts: 0, events: [] };
    day.checkIns += 1;
    day.events.push({
      bookingId: row.id,
      listingTitle: row.listing?.title ?? "Listing",
      guestName: names.get(row.user_id) ?? "Guest",
      kind: "check-in",
    });
    byDate.set(key, day);
  }
  for (const row of (checkOuts ?? []) as unknown as EventRow[]) {
    const key = row.check_out;
    const day = byDate.get(key) ?? { date: key, checkIns: 0, checkOuts: 0, events: [] };
    day.checkOuts += 1;
    day.events.push({
      bookingId: row.id,
      listingTitle: row.listing?.title ?? "Listing",
      guestName: names.get(row.user_id) ?? "Guest",
      kind: "check-out",
    });
    byDate.set(key, day);
  }
  return Array.from(byDate.values());
}

export interface DashboardOverview {
  totalProperties: number;
  activeListings: number;
  draftListings: number;
  occupancyRate: number;
  upcomingCheckIns: AdminBookingSummary[];
  upcomingCheckOuts: AdminBookingSummary[];
  activeReservations: number;
  pendingReservations: number;
  revenueToday: Money;
  revenueThisMonth: Money;
  revenueThisYear: Money;
  recentBookings: AdminBookingSummary[];
  recentCustomers: RecentCustomer[];
  recentReviews: RecentReview[];
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const now = new Date();
  const todayIso = startOfDay(now).toISOString();
  const monthStartIso = startOfMonth(now).toISOString();
  const yearStartIso = startOfYear(now).toISOString();

  const [
    totalProperties,
    activeListings,
    draftListings,
    occupancyRate,
    upcomingCheckIns,
    upcomingCheckOuts,
    activeReservations,
    pendingReservations,
    revenueToday,
    revenueThisMonth,
    revenueThisYear,
    recentBookings,
    recentCustomers,
    recentReviews,
  ] = await Promise.all([
    countListings(),
    countListings("published"),
    countListings("draft"),
    getOccupancyRate(),
    getUpcoming("check_in"),
    getUpcoming("check_out"),
    countBookingsByStatuses(ACTIVE_RESERVATION_STATUSES),
    countBookingsByStatuses(PENDING_RESERVATION_STATUSES),
    sumRevenueSince(todayIso),
    sumRevenueSince(monthStartIso),
    sumRevenueSince(yearStartIso),
    getAllBookingsAdmin({ limit: 5, orderBy: "created_at" }),
    getRecentCustomers(),
    getRecentReviews(),
  ]);

  return {
    totalProperties,
    activeListings,
    draftListings,
    occupancyRate,
    upcomingCheckIns,
    upcomingCheckOuts,
    activeReservations,
    pendingReservations,
    revenueToday: { amount: revenueToday, currency: "MAD" },
    revenueThisMonth: { amount: revenueThisMonth, currency: "MAD" },
    revenueThisYear: { amount: revenueThisYear, currency: "MAD" },
    recentBookings,
    recentCustomers,
    recentReviews,
  };
}
