import type { Metadata } from "next";
import Link from "next/link";
import { getAllBookingsAdmin } from "@/lib/data/admin/bookings";
import { BookingsTable } from "@/components/admin/bookings-table";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/data/types";

export const metadata: Metadata = { title: "Bookings — LUMA Admin" };
export const dynamic = "force-dynamic";

const FILTERS: { label: string; status?: BookingStatus }[] = [
  { label: "All" },
  { label: "Pending", status: "pending" },
  { label: "Confirmed", status: "confirmed" },
  { label: "Checked in", status: "checked_in" },
  { label: "Checked out", status: "checked_out" },
  { label: "Completed", status: "completed" },
  { label: "Cancelled", status: "cancelled" },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const bookings = await getAllBookingsAdmin({ status: status as BookingStatus | undefined });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label-eyebrow">Operations</p>
        <h1 className="mt-1 font-heading text-2xl font-medium text-foreground md:text-3xl">Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">{bookings.length} reservations</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={f.status ? `/admin/bookings?status=${f.status}` : "/admin/bookings"}
            className={cn(
              "tracking-label rounded-full border px-3 py-1 text-xs font-medium uppercase transition-colors",
              status === f.status || (!status && !f.status)
                ? "border-gold bg-gold/10 text-gold"
                : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <BookingsTable bookings={bookings} />
    </div>
  );
}
