-- Bookings table with database-enforced double-booking prevention.
--
-- The exclude constraint below rejects (Postgres error 23P01) any insert
-- whose [check_in, check_out) range overlaps an existing non-cancelled
-- booking for the same listing — enforced atomically inside the same
-- transaction as the insert, so two concurrent requests for the same dates
-- can't both succeed (no app-level check-then-insert race).

create table bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null references listings(id),
  user_id uuid not null references auth.users(id),
  check_in date not null,
  check_out date not null,
  guests int not null,
  nights int generated always as (check_out - check_in) stored,
  price_per_night_snapshot numeric(10, 2) not null,
  cleaning_fee_snapshot numeric(10, 2) not null,
  service_fee numeric(10, 2) not null,
  total numeric(10, 2) not null,
  status booking_status not null default 'confirmed',
  stay_range daterange generated always as
    (daterange(check_in, check_out, '[)')) stored,
  created_at timestamptz not null default now(),
  constraint check_dates check (check_out > check_in),
  constraint no_overlapping_bookings
    exclude using gist (
      listing_id with =,
      stay_range with &&
    ) where (status <> 'cancelled')
);

create index bookings_user_idx on bookings (user_id);
create index bookings_listing_idx on bookings (listing_id);
