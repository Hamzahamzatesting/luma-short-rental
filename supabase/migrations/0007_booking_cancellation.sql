-- Lets a signed-in user cancel their own upcoming, not-yet-cancelled
-- booking. This is the one client-permitted status transition (superseding
-- the "no client update" note in 0005_rls_policies.sql now that
-- cancellation is built). The exclude constraint in 0003_bookings.sql
-- already ignores cancelled rows, so cancelling immediately frees the dates.
--
-- "using" gates which existing rows are eligible for update; "with check"
-- gates what the row is allowed to look like afterward. Together they only
-- permit a non-cancelled, still-future booking to move to 'cancelled' —
-- never the reverse, and never someone else's row.

create policy "users cancel own bookings" on bookings
  for update
  using (auth.uid() = user_id and status <> 'cancelled' and check_in > current_date)
  with check (auth.uid() = user_id and status = 'cancelled');
