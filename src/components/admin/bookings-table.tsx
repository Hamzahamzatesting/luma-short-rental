"use client";

import Image from "next/image";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { ActionButton } from "@/components/admin/action-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cancelBookingAdmin, confirmBooking, rejectBooking } from "@/lib/actions/admin/bookings";
import type { AdminBookingSummary } from "@/lib/data/admin/bookings";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const columns: ColumnDef<AdminBookingSummary>[] = [
  {
    accessorKey: "listingTitle",
    header: "Property",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <Link href={`/admin/bookings/${booking.id}`} className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
            {booking.listingImage ? (
              <Image src={booking.listingImage} alt="" fill className="object-cover" sizes="40px" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{booking.listingTitle}</p>
            <p className="truncate text-xs text-muted-foreground">{booking.guestName}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "checkIn",
    header: "Dates",
    cell: ({ row }) => `${formatDate(row.original.checkIn)} – ${formatDate(row.original.checkOut)}`,
  },
  {
    accessorKey: "guests",
    header: "Guests",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `${row.original.total.amount.toLocaleString()} ${row.original.total.currency}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;
      const canConfirm = booking.status === "pending" || booking.status === "awaiting_payment";
      const canCancel = !["cancelled", "refunded", "completed"].includes(booking.status);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href={`/admin/bookings/${booking.id}`}>View details</Link>} />
            {canConfirm ? (
              <ActionButton
                action={confirmBooking}
                formData={{ id: booking.id }}
                successMessage="Confirmed — guest notified by email"
                variant="ghost"
                size="sm"
                className="w-full justify-start px-1.5 font-normal"
              >
                Confirm
              </ActionButton>
            ) : null}
            {canConfirm ? (
              <ActionButton
                action={rejectBooking}
                formData={{ id: booking.id }}
                successMessage="Rejected — guest notified by email"
                variant="ghost"
                size="sm"
                className="w-full justify-start px-1.5 font-normal text-destructive hover:text-destructive"
              >
                Reject
              </ActionButton>
            ) : null}
            {canCancel && !canConfirm ? (
              <ActionButton
                action={cancelBookingAdmin}
                formData={{ id: booking.id }}
                successMessage="Cancelled — guest notified by email"
                variant="ghost"
                size="sm"
                className="w-full justify-start px-1.5 font-normal text-destructive hover:text-destructive"
              >
                Cancel
              </ActionButton>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function BookingsTable({ bookings }: { bookings: AdminBookingSummary[] }) {
  return <DataTable columns={columns} data={bookings} emptyMessage="No bookings yet." />;
}
