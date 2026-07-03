import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Privacy Policy | LUMA",
  description: "How LUMA collects, uses, and protects your information.",
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

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28">
        <Section spacing="tight">
          <p className="label-eyebrow mb-2">Legal</p>
          <h1 className="mb-2 font-serif text-3xl text-foreground md:text-4xl">Privacy Policy</h1>
          <p className="mb-10 text-xs text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <Reveal className="mx-auto max-w-2xl">
            <P>
              This policy explains what information LUMA collects when you use the site, why we collect
              it, and what you can do about it. We collect only what we need to run reservations and
              respond to you — we don&apos;t sell your data, and we don&apos;t run third-party ad tracking
              on this site.
            </P>

            <H2>1. Information we collect</H2>
            <P>We collect information in a few ways:</P>
            <Ul>
              <li>
                <strong className="text-foreground">Account information</strong>{" "}— your name and email
                when you create an account.
              </li>
              <li>
                <strong className="text-foreground">Booking information</strong>{" "}— the property, dates,
                guest count, and price for any stay you book, and any cancellation you make.
              </li>
              <li>
                <strong className="text-foreground">Messages</strong>{" "}— anything you send us through the
                contact form, or a review you leave after a stay.
              </li>
              <li>
                <strong className="text-foreground">Saved stays</strong>{" "}— the properties you favorite,
                tied to your account.
              </li>
              <li>
                <strong className="text-foreground">Basic usage data</strong>{" "}— which pages get visited,
                collected anonymously (see &ldquo;Analytics&rdquo; below).
              </li>
            </Ul>
            <P>
              <strong className="text-foreground">We do not collect payment card details.</strong>{" "}LUMA
              doesn&apos;t process payments online today — payment for a confirmed booking is arranged
              directly between you and our concierge team, outside the platform.
            </P>

            <H2>2. How we use it</H2>
            <Ul>
              <li>To create and confirm your reservations, and to send you confirmation, reminder, and cancellation emails.</li>
              <li>To respond when you contact us.</li>
              <li>To show your saved stays and past bookings when you&apos;re signed in.</li>
              <li>To moderate reviews before they&apos;re published, so they stay genuine.</li>
              <li>To understand, in aggregate, which parts of the site people actually use, so we can improve it.</li>
            </Ul>

            <H2>3. Cookies &amp; local storage</H2>
            <P>
              LUMA uses one essential cookie to keep you signed in between visits — the site doesn&apos;t
              work without it, so there&apos;s nothing to opt out of. We also store a random, anonymous
              identifier in your browser&apos;s local storage, used only to count page visits in aggregate
              (see below). It isn&apos;t linked to your name or email unless you&apos;re signed in, and
              it&apos;s never shared with advertisers or used to track you on other sites.
            </P>

            <H2>4. Analytics</H2>
            <P>
              We record which pages are visited and roughly how many distinct visitors we get, so we can
              see what&apos;s working on the site. This is self-hosted — we don&apos;t send this data to
              Google, Meta, or any other analytics or advertising company. The data we keep is aggregate
              (page paths and counts); we don&apos;t build individual browsing profiles from it.
            </P>

            <H2>5. Who we share information with</H2>
            <P>
              We use a small number of service providers to run LUMA, and share only what each one needs
              to do its job:
            </P>
            <Ul>
              <li>
                <strong className="text-foreground">Supabase</strong>{" "}— hosts our database and handles
                account sign-in.
              </li>
              <li>
                <strong className="text-foreground">Resend</strong>{" "}— delivers our confirmation, booking,
                and contact-form emails.
              </li>
            </Ul>
            <P>
              We don&apos;t sell your information to anyone, and we don&apos;t share it with data brokers
              or advertisers.
            </P>

            <H2>6. How long we keep it</H2>
            <P>
              We keep your account and booking history for as long as your account is active, so you can
              see your past stays. You can delete your account at any time from your account settings,
              which removes your profile and associated data from our systems.
            </P>

            <H2>7. Your rights</H2>
            <P>
              You can view and update your account details at any time, and delete your account whenever
              you&apos;d like. If you&apos;d like a copy of your data, or have any other question about
              what we hold, reach out through our{" "}
              <a href="/contact" className="text-gold underline underline-offset-2">
                contact page
              </a>{" "}
              and we&apos;ll help directly.
            </P>

            <H2>8. Security</H2>
            <P>
              Your data is stored with row-level access controls, so it&apos;s only reachable by the
              account it belongs to or by our team for the purpose of running your reservation. No system
              is perfectly secure, but we take reasonable, industry-standard steps to protect your
              information.
            </P>

            <H2>9. Children</H2>
            <P>LUMA isn&apos;t directed at children, and we don&apos;t knowingly collect information from anyone under 16.</P>

            <H2>10. Changes to this policy</H2>
            <P>
              If we make a material change to how we handle your information, we&apos;ll update the date at
              the top of this page.
            </P>

            <H2>11. Contact</H2>
            <P>
              Questions about this policy or your data? Reach us through our{" "}
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
