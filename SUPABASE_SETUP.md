# Supabase Setup (Phase 2)

Manual steps only you can perform — none of this can be run from this environment.

## 1. Create the project

Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard). Pick a region close to your users (e.g. `eu-west` for a Morocco-based platform).

## 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the three values from **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Restart `npm run dev` after saving — Next.js only reads env vars at process start.

## 3. Run the migrations

In the Supabase dashboard's **SQL Editor**, run each file in `supabase/migrations/` in order:

1. `0001_extensions_and_enums.sql`
2. `0002_catalog_tables.sql`
3. `0003_bookings.sql`
4. `0004_profiles_and_auth_trigger.sql`
5. `0005_rls_policies.sql`
6. `0006_public_booked_ranges_view.sql`
7. `0007_booking_cancellation.sql`
8. `0008_account_deletion_cascade.sql`
9. `0009_profiles_role.sql`
10. `0010_listings_admin_fields.sql`
11. `0011_bookings_admin_lifecycle.sql`
12. `0012_media_storage.sql`
13. `0013_admin_email_allowlist.sql`
14. `0014_rate_limit_attempts.sql`
15. `0015_review_moderation.sql`
16. `0016_media_upload_limits.sql`
17. `0017_availability_blocks.sql`
18. `0018_reviews_guest_submission.sql`
19. `0019_bookings_refund_tracking.sql`
20. `0020_favorites.sql`

Then run `supabase/seed.sql` to populate the catalog (21 listings, 7 destinations, 5 hosts, 84 reviews, 6 testimonials, 6 FAQs — transcribed from the Phase 1 mock data). If you ever change the mock fixtures and want to regenerate it: `npx tsx scripts/generate-seed.ts > supabase/seed.sql`.

## 4. Email auth

**Authentication → Providers → Email**: enable "Confirm email."

**Authentication → URL Configuration**: set Site URL to your dev URL (`http://localhost:3000`) and add `http://localhost:3000/auth/callback` as a redirect URL (add your production URL and its `/auth/callback` too once deployed).

## 5. Google OAuth (optional — the button is wired but inert until this is done)

1. **Authentication → Providers → Google** in Supabase: enable it. Note the callback URL it shows you (`https://<project-ref>.supabase.co/auth/v1/callback`).
2. In [Google Cloud Console](https://console.cloud.google.com/): create an OAuth 2.0 Client ID (Application type: Web application), and add the callback URL from step 1 as an Authorized redirect URI.
3. Paste the generated Client ID and Client Secret back into the Supabase Google provider settings.

Until this is done, clicking "Continue with Google" will show an error — that's expected.

## 6. Verify RLS

Supabase creates new tables with Row Level Security **off** by default. `0005_rls_policies.sql` turns it on for every table, but it's worth double-checking in **Database → Tables** that RLS shows as enabled on: `destinations`, `hosts`, `amenities`, `listings`, `reviews`, `testimonials`, `faqs`, `profiles`, `bookings`.

## 7. Branded auth emails (Supabase)

Supabase's default auth emails are unbranded. Paste the branded versions into **Authentication → Emails → Templates**:

- **Confirm signup** → paste `supabase/email-templates/confirm-signup.html`, subject `Confirm your email — LUMA`
- **Reset Password** → paste `supabase/email-templates/reset-password.html`, subject `Reset your password — LUMA`
- **Magic Link** → paste `supabase/email-templates/magic-link.html`, subject `Sign in to LUMA`
- **Invite user** → paste `supabase/email-templates/invite.html`, subject `You've been invited to LUMA`
- **Change Email Address** → paste `supabase/email-templates/email-change.html`, subject `Confirm your new email — LUMA`
- **Reauthentication** → paste `supabase/email-templates/reauthentication.html`, subject `Your LUMA confirmation code`

## 8. Booking confirmation emails (Resend)

Booking confirmations are sent by our own code (not Supabase), via [Resend](https://resend.com). Add to `.env.local`:

```
RESEND_API_KEY=
RESEND_FROM_EMAIL=LUMA <onboarding@resend.dev>
```

The sandbox sender (`onboarding@resend.dev`) works immediately with no setup, but mail providers often route it to spam since it's a shared domain used by many test apps — expect to find test emails in Spam and mark them "Not spam." **Before going live**, verify your own domain in Resend (Domains → Add Domain → add the TXT/CNAME records it gives you to your DNS), then change `RESEND_FROM_EMAIL` to `LUMA <bookings@yourdomain.com>` for reliable inbox delivery.

## 9. Admin dashboard (Phase 3)

Migrations `0009`–`0013` add an admin role, a `listing-media` Storage bucket (public read, admin-only write), and the extra listing/booking fields the `/admin` dashboard needs.

1. **Grant admin access by email, ahead of time** — in the SQL Editor:
   ```sql
   insert into admin_emails (email) values ('someone@example.com');
   ```
   Then create that person's account however you like — **Authentication → Add User** in the Supabase dashboard (set a password directly, no email step needed), or have them sign up normally through the app. Either way, their `profiles.role` is set to `'admin'` the moment their account is created — no follow-up step.

   This only affects *new* accounts. To promote someone who already signed up before being allowlisted:
   ```sql
   update profiles set role = 'admin' where id = '<their-user-uuid>';
   ```
   (Find the UUID in **Authentication → Users**.) Either way, only the service-role client can set `role` — a trigger blocks a signed-in user from promoting themselves, even via the allowlist trick (it only runs at account-creation time).
2. **Verify the bucket**: **Storage** should show a `listing-media` bucket (public). Property image/video uploads in the admin dashboard go there.
3. Once granted, sign in and visit `/admin`.

## What to expect once this is done

- Home, Search, and every listing page will show the real seeded catalog instead of an empty state.
- Sign up → check email → confirm → sign in works end-to-end.
- Booking a listing requires being signed in, writes a real row to `bookings`, and is protected against double-booking at the database level (two people can't reserve overlapping dates for the same listing, even under concurrent requests).
- `/bookings` shows your own reservations; the confirmation page at `/bookings/[id]/confirmation` shows the price breakdown.

## Still out of scope

Payment processing; the availability calendar, pricing rules engine, customer CRM, review moderation, content CMS, media library, analytics, granular admin roles, and third-party integrations (all deferred parts of Phase 3).
