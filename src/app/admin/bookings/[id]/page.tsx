import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBookingByIdAdmin } from "@/lib/data/admin/bookings";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { BookingTimeline } from "@/components/admin/booking-timeline";
import {
  BookingQuickActions,
  BookingStatusControl,
  BookingDatesForm,
  BookingNoteForm,
} from "@/components/admin/booking-detail-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Booking — LUMA Admin" };
export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

function money(amount: number, currency: string) {
  return `${amount.toLocaleString()} ${currency}`;
}

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingByIdAdmin(id);
  if (!booking) notFound();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-medium text-foreground">{booking.listingTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {booking.guestName}
            {booking.guestEmail ? ` · ${booking.guestEmail}` : ""}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} className="h-6 px-3 text-xs" />
      </div>

      <BookingQuickActions booking={booking} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stay details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              {booking.listingImage ? (
                <Image src={booking.listingImage} alt="" fill className="object-cover" sizes="400px" />
              ) : null}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span className="text-foreground">{formatDate(booking.checkIn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span className="text-foreground">{formatDate(booking.checkOut)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span className="text-foreground">{booking.guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nights</span>
              <span className="text-foreground">{booking.nights}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {money(booking.pricePerNightSnapshot.amount, booking.pricePerNightSnapshot.currency)} × {booking.nights}
              </span>
              <span className="text-foreground">
                {money(booking.pricePerNightSnapshot.amount * booking.nights, booking.pricePerNightSnapshot.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cleaning fee</span>
              <span className="text-foreground">{money(booking.cleaningFeeSnapshot.amount, booking.cleaningFeeSnapshot.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service fee</span>
              <span className="text-foreground">{money(booking.serviceFee.amount, booking.serviceFee.currency)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{money(booking.total.amount, booking.total.currency)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingTimeline status={booking.status} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <BookingStatusControl booking={booking} />
          <Separator />
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Move dates</p>
            <BookingDatesForm booking={booking} />
          </div>
          <Separator />
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Internal notes</p>
            <BookingNoteForm booking={booking} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
