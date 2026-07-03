-- Persists saved listings per guest — the heart button was previously
-- local component state only, resetting on every page load.

create table favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id text not null references listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table favorites enable row level security;

create policy "users manage own favorites" on favorites
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
