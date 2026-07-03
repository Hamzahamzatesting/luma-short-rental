-- Lets an admin take a property offline for maintenance, an owner stay, or
-- any other non-guest reason — availability was previously derived purely
-- from real bookings, so a unit under repair still looked bookable.

create table availability_blocks (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null references listings(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text not null check (reason in ('maintenance', 'owner_stay', 'other')),
  notes text,
  created_at timestamptz not null default now(),
  check (end_date > start_date)
);

create index availability_blocks_listing_idx on availability_blocks (listing_id, start_date, end_date);

alter table availability_blocks enable row level security;
-- No policies on the base table — same pattern as bookings in
-- 0005_rls_policies.sql. The admin dashboard reads/writes this via the
-- service-role client only; guests never see the reason/notes, just the
-- resulting unavailable dates, exposed narrowly through the view below
-- (views run with the owner's privileges, unaffected by the base table's
-- lack of anon/authenticated policies).

create view public.blocked_date_ranges as
  select listing_id, start_date, end_date from availability_blocks;

grant select on public.blocked_date_ranges to anon, authenticated;
