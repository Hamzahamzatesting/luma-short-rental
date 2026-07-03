import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerDetailAdmin } from "@/lib/data/admin/customers";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Customer — LUMA Admin" };
export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerDetailAdmin(id);
  if (!customer) notFound();

  const totalSpent = customer.bookings
    .filter((b) => !["cancelled", "refunded"].includes(b.status))
    .reduce((sum, b) => sum + b.total.amount, 0);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium text-foreground">{customer.name}</h1>
        <p className="text-sm text-muted-foreground">
          {customer.email} &middot; guest since {formatDate(customer.joinedAt)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Total stays</p>
            <p className="mt-1 font-heading text-2xl font-medium text-foreground">{customer.bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Total spent</p>
            <p className="mt-1 font-heading text-2xl font-medium text-foreground">{totalSpent.toLocaleString()} MAD</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservation history</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {customer.bookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            customer.bookings.map((b) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{b.listingTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(b.checkIn)} &ndash; {formatDate(b.checkOut)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm text-foreground">{b.total.amount.toLocaleString()} {b.total.currency}</span>
                  <BookingStatusBadge status={b.status} />
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
