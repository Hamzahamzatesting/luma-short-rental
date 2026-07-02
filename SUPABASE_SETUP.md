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

## What to expect once this is done

- Home, Search, and every listing page will show the real seeded catalog instead of an empty state.
- Sign up → check email → confirm → sign in works end-to-end.
- Booking a listing requires being signed in, writes a real row to `bookings`, and is protected against double-booking at the database level (two people can't reserve overlapping dates for the same listing, even under concurrent requests).
- `/bookings` shows your own reservations; the confirmation page at `/bookings/[id]/confirmation` shows the price breakdown.

## Still out of scope for Phase 2

Payment processing, booking cancellation/modification, the admin CMS (Phase 3), and migrating photography off Unsplash into Supabase Storage.
