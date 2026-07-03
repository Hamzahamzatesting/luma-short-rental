import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Terms of Service | LUMA",
  description: "The terms that govern use of the LUMA platform and any stay booked through it.",
};

const LAST_UPDATED = "July 3, 2026";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-10 font-serif text-xl text-foreground first:mt-0">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="mb-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{children}</ul>;
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28">
        <Section spacing="tight">
          <p className="label-eyebrow mb-2">Legal</p>
          <h1 className="mb-2 font-serif text-3xl text-foreground md:text-4xl">Terms of Service</h1>
          <p className="mb-10 text-xs text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <Reveal className="mx-auto max-w-2xl">
            <P>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the LUMA website and any
              reservation made through it. By creating an account or booking a stay with LUMA, you agree
              to these Terms. If you don&apos;t agree with them, please don&apos;t use the platform.
            </P>

            <H2>1. What LUMA is</H2>
            <P>
              LUMA is a curated short-term rental platform. Every property listed on LUMA is reviewed and
              published by our team, and each is managed on the ground by a designated host. LUMA
              coordinates the booking and stay on your behalf; the underlying property is owned or managed
              by the host associated with that listing.
            </P>

            <H2>2. Accounts</H2>
            <P>
              You need an account to book a stay. You&apos;re responsible for keeping your login details
              secure and for all activity under your account. Provide accurate information when you sign
              up — we use your name and email to confirm reservations and reach you about your stay.
            </P>

            <H2>3. Making a reservation</H2>
            <P>
              When you submit a booking request, LUMA checks the property&apos;s real-time availability
              and confirms your dates immediately if they&apos;re open. The price shown at checkout — nightly
              rate, cleaning fee, and service fee — is the total due for the stay, in Moroccan Dirhams
              (MAD) unless otherwise stated.
            </P>
            <P>
              <strong className="text-foreground">Payment.</strong>{" "}LUMA does not currently charge your
              card automatically at the time of booking. Once your reservation is confirmed, a member of
              our concierge team will contact you directly to arrange payment ahead of your stay. Your
              dates are held for you in the meantime.
            </P>

            <H2>4. Cancellations &amp; refunds</H2>
            <P>
              Each property has one of three cancellation policies, shown on the listing before you book:
            </P>
            <Ul>
              <li>
                <strong className="text-foreground">Flexible</strong>{" "}— full refund if you cancel at least
                1 day before check-in.
              </li>
              <li>
                <strong className="text-foreground">Moderate</strong>{" "}— full refund 5+ days before
                check-in; 50% refund 1&ndash;4 days before check-in.
              </li>
              <li>
                <strong className="text-foreground">Strict</strong>{" "}— 50% refund 7+ days before check-in;
                no refund inside 7 days.
              </li>
            </Ul>
            <P>
              You can cancel a reservation from your account up until check-in. The refund percentage
              you&apos;re eligible for is calculated automatically against the policy in effect at the time
              you booked, and shown to you before you confirm the cancellation. Because payment is arranged
              directly with our concierge team rather than charged automatically, any refund owed is
              settled with you directly rather than reversed on a card.
            </P>

            <H2>5. Your stay</H2>
            <P>
              You agree to treat the property with care, follow any house rules listed on the property
              page, and leave it in the condition you found it. You&apos;re responsible for the conduct of
              everyone in your party and for any damage caused during your stay beyond normal wear and
              tear.
            </P>

            <H2>6. Reviews</H2>
            <P>
              After a completed stay, you may leave a review. Reviews are checked by our team before they
              appear publicly — this is to keep reviews genuine and tied to real stays, not to filter
              honest feedback. We may decline to publish a review that is abusive, fake, or unrelated to
              the stay itself.
            </P>

            <H2>7. Limitation of liability</H2>
            <P>
              LUMA works to make sure every listing is accurately represented and every host is reliable,
              but we don&apos;t own the properties booked through the platform. To the fullest extent
              permitted by law, LUMA isn&apos;t liable for issues arising from the property itself or from
              your stay that are outside our reasonable control. Nothing in these Terms limits liability
              that can&apos;t be excluded under applicable law.
            </P>

            <H2>8. Changes to these Terms</H2>
            <P>
              We may update these Terms from time to time as the platform evolves. If we make a material
              change, we&apos;ll update the date at the top of this page. Continuing to use LUMA after a
              change means you accept the updated Terms.
            </P>

            <H2>9. Contact</H2>
            <P>
              Questions about these Terms? Reach us through our{" "}
              <a href="/contact" className="text-gold underline underline-offset-2">
                contact page
              </a>
              .
            </P>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
