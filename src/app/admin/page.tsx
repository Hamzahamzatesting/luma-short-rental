import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  FileEdit,
  Gauge,
  LogIn,
  LogOut,
  CalendarCheck2,
  Hourglass,
  Wallet,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { getDashboardOverview, getCalendarOverview } from "@/lib/data/admin/dashboard";
import { StatCard } from "@/components/admin/stat-card";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { MiniCalendar } from "@/components/admin/mini-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Overview — LUMA Admin" };
export const dynamic = "force-dynamic";

function money(amount: number) {
  return `${amount.toLocaleString("en-US")} MAD`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminOverviewPage() {
  const now = new Date();
  const [overview, calendarDays] = await Promise.all([
    getDashboardOverview(),
    getCalendarOverview(now.getMonth(), now.getFullYear()),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">The state of LUMA&apos;s business, right now.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total properties" value={String(overview.totalProperties)} icon={Building2} />
        <StatCard label="Active listings" value={String(overview.activeListings)} icon={Gauge} />
        <StatCard label="Draft listings" value={String(overview.draftListings)} icon={FileEdit} />
        <StatCard label="Occupancy rate" value={`${overview.occupancyRate}%`} icon={CalendarRange} hint="This month" />
        <StatCard label="Active reservations" value={String(overview.activeReservations)} icon={CalendarCheck2} />
        <StatCard label="Pending reservations" value={String(overview.pendingReservations)} icon={Hourglass} />
        <StatCard label="Upcoming check-ins" value={String(overview.upcomingCheckIns.length)} icon={LogIn} hint="Next 7 days" />
        <StatCard label="Upcoming check-outs" value={String(overview.upcomingCheckOuts.length)} icon={LogOut} hint="Next 7 days" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Revenue today" value={money(overview.revenueToday.amount)} icon={Wallet} />
        <StatCard label="Revenue this month" value={money(overview.revenueThisMonth.amount)} icon={Wallet} />
        <StatCard label="Revenue this year" value={money(overview.revenueThisYear.amount)} icon={Wallet} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniCalendar month={now.getMonth()} year={now.getFullYear()} days={calendarDays} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent bookings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {overview.recentBookings.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              overview.recentBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{b.listingTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.guestName} &middot; {formatDate(b.checkIn)} &ndash; {formatDate(b.checkOut)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm text-foreground">{money(b.total.amount)}</span>
                    <BookingStatusBadge status={b.status} />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="size-4" /> Upcoming check-ins
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {overview.upcomingCheckIns.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Nothing in the next 7 days.</p>
            ) : (
              overview.upcomingCheckIns.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2 text-sm first:pt-0 last:pb-0">
                  <span className="truncate text-foreground">{b.listingTitle}</span>
                  <span className="shrink-0 text-muted-foreground">{formatDate(b.checkIn)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4" /> Recent customers
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {overview.recentCustomers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No guests yet.</p>
            ) : (
              overview.recentCustomers.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 text-sm first:pt-0 last:pb-0">
                  <span className="truncate text-foreground">{c.name}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {c.stayCount} stay{c.stayCount > 1 ? "s" : ""} &middot; {money(c.totalSpent.amount)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest reviews</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {overview.recentReviews.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              overview.recentReviews.map((r) => (
                <div key={r.id} className="py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{r.authorName}</span>
                    <span className="text-gold">{r.rating.toFixed(1)}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{r.listingTitle}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
