-- A narrow, publicly-readable view exposing only which date ranges are
-- taken per listing (no user_id, no price) so search/availability checks
-- can run with the anon key, without granting broad read access to the
-- bookings table itself (which stays locked to "own rows only" via RLS
-- in 0005_rls_policies.sql).
--
-- Views run with the owner's privileges by default (Postgres 15+
-- `security_invoker` defaults to false), so this view sees every booking
-- regardless of the querying role's RLS restrictions on the base table.

create view public.booked_date_ranges as
  select listing_id, check_in, check_out
  from bookings
  where status <> 'cancelled';

grant select on public.booked_date_ranges to anon, authenticated;
