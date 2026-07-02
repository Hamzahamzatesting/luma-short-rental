import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getBookingsForUser, canCancelBooking } from "@/lib/data/bookings";
import { CancelBookingDialog } from "@/components/bookings/cancel-booking-dialog";

export const metadata: Metadata = { title: "My Bookings | LUMA" };

const STATUS_STYLE: Record<string, string> = {
  confirmed: "text-gold border-gold/50",
  pending: "text-muted-foreground border-border",
  cancelled: "text-destructive border-destructive/40",
};

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/bookings");

  const bookings = await getBookingsForUser();

  return (
    <>
      <Navbar />
      <main className="pt-28">
        <Section spacing="tight">
          <p className="label-eyebrow mb-2">Your Account</p>
          <h1 className="mb-10 font-serif text-3xl text-foreground md:text-4xl">My Bookings</h1>

          {bookings.length === 0 ? (
            <Reveal className="rounded-lg border border-border bg-card p-10 text-center">
              <p className="mb-4 text-muted-foreground">You haven&apos;t booked a stay yet.</p>
              <Button render={<Link href="/search">Explore Stays</Link>} nativeButton={false} />
            </Reveal>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking, i) => (
                <Reveal key={booking.id} delay={Math.min(i * 0.06, 0.3)}>
                  <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-gold/40 sm:flex-row sm:items-center">
                    <Link
                      href={`/bookings/${booking.id}/confirmation`}
                      className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center"
                    >
                      {booking.listingImage && (
                        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-32">
                          <Image
                            src={booking.listingImage}
                            alt={booking.listingTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="text-xs uppercase tracking-label text-muted-foreground">
                          {booking.listingCity}
                        </p>
                        <h3 className="font-serif text-lg text-foreground">{booking.listingTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.checkIn).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          &ndash;{" "}
                          {new Date(booking.checkOut).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          &middot; {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                        </p>
                      </div>
                    </Link>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs uppercase tracking-label ${STATUS_STYLE[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                      <p className="font-medium text-foreground">
                        {booking.total.amount.toLocaleString()} MAD
                      </p>
                      {canCancelBooking(booking) && (
                        <CancelBookingDialog bookingId={booking.id} listingTitle={booking.listingTitle} />
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
