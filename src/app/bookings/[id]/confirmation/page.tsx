import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { getBookingById } from "@/lib/data/bookings";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const dateFormat: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };

  return (
    <>
      <Navbar />
      <main className="pt-28">
        <Section spacing="tight">
          <Reveal className="mx-auto max-w-xl text-center">
            <CheckCircle2 className="mx-auto mb-4 text-gold" size={40} strokeWidth={1.5} />
            <p className="label-eyebrow mb-2">Reservation Confirmed</p>
            <h1 className="mb-3 font-serif text-3xl text-foreground md:text-4xl">
              You&apos;re all set
            </h1>
            <p className="text-muted-foreground">
              A confirmation has been saved to your account. We look forward to hosting you.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-xl overflow-hidden rounded-lg border border-border bg-card">
            {booking.listingImage && (
              <div className="relative aspect-[16/9]">
                <Image
                  src={booking.listingImage}
                  alt={booking.listingTitle}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-label text-muted-foreground">
                  {booking.listingCity}
                </p>
                <h2 className="font-serif text-xl text-foreground">{booking.listingTitle}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border py-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-label text-muted-foreground">Check-in</p>
                  <p className="text-foreground">
                    {new Date(booking.checkIn).toLocaleDateString("en-US", dateFormat)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-label text-muted-foreground">Check-out</p>
                  <p className="text-foreground">
                    {new Date(booking.checkOut).toLocaleDateString("en-US", dateFormat)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-label text-muted-foreground">Guests</p>
                  <p className="text-foreground">{booking.guests}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-label text-muted-foreground">Status</p>
                  <p className="capitalize text-foreground">{booking.status}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {booking.pricePerNightSnapshot.amount.toLocaleString()} MAD &times; {booking.nights} night
                    {booking.nights > 1 ? "s" : ""}
                  </span>
                  <span>
                    {(booking.pricePerNightSnapshot.amount * booking.nights).toLocaleString()} MAD
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Cleaning fee</span>
                  <span>{booking.cleaningFeeSnapshot.amount.toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service fee</span>
                  <span>{booking.serviceFee.amount.toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-medium text-foreground">
                  <span>Total</span>
                  <span>{booking.total.amount.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto mt-8 flex max-w-xl justify-center gap-3">
            <Button render={<Link href="/bookings">View My Bookings</Link>} nativeButton={false} variant="gold-outline" />
            <Button render={<Link href="/search">Explore More Stays</Link>} nativeButton={false} />
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
