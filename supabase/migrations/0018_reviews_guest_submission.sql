-- Lets a guest actually submit a review after a real stay, instead of
-- every review being seeded/admin-only. A review is tied to the specific
-- booking it came from, both to verify the stay really happened and to
-- stop the same booking from being reviewed twice.

alter table reviews
  add column user_id uuid references auth.users(id) on delete set null,
  add column booking_id uuid references bookings(id) on delete set null;

create unique index reviews_one_per_booking_idx
  on reviews (booking_id) where booking_id is not null;

-- Guests may create a review for their own completed stay. It always
-- lands as 'pending' — the `with check` blocks a client from inserting
-- (or later flipping) any other status, so moderation still only happens
-- through the admin service-role actions in src/lib/actions/admin/reviews.ts.
create policy "users insert own pending reviews" on reviews
  for insert
  with check (auth.uid() = user_id and status = 'pending');
