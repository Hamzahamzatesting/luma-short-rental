-- Row Level Security. Catalog tables are publicly readable (this is a
-- marketing site — anon visitors browse listings before signing up).
-- profiles and bookings are scoped to their owning user. There is no
-- client-side update/delete policy on bookings: cancellation is a Phase 3
-- admin concern, and the service-role client (src/lib/supabase/admin.ts)
-- bypasses RLS entirely when that's built.

alter table destinations enable row level security;
alter table hosts enable row level security;
alter table amenities enable row level security;
alter table listings enable row level security;
alter table reviews enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table profiles enable row level security;
alter table bookings enable row level security;

create policy "public read destinations" on destinations for select using (true);
create policy "public read hosts" on hosts for select using (true);
create policy "public read amenities" on amenities for select using (true);
create policy "public read listings" on listings for select using (true);
create policy "public read reviews" on reviews for select using (true);
create policy "public read testimonials" on testimonials for select using (true);
create policy "public read faqs" on faqs for select using (true);

create policy "users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "users update own profile" on profiles
  for update using (auth.uid() = id);

create policy "users insert own bookings" on bookings
  for insert with check (auth.uid() = user_id);
create policy "users read own bookings" on bookings
  for select using (auth.uid() = user_id);
