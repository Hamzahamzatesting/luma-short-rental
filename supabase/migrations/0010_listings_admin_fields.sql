-- Fields the Phase 3 admin dashboard needs to manage a listing's lifecycle,
-- media, and basic pricing/policy/SEO configuration.

alter table listings
  add column status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  add column videos text[] not null default '{}',
  add column security_deposit_amount numeric(10, 2),
  add column security_deposit_currency text,
  add column cancellation_policy text
    check (cancellation_policy in ('flexible', 'moderate', 'strict')),
  add column seo_title text,
  add column seo_description text,
  add column updated_at timestamptz not null default now();

-- Default is 'published' so the 21 seeded listings stay live on the public
-- site; the admin "create property" flow sets status: 'draft' explicitly
-- at the application layer for anything new.

create index listings_status_idx on listings (status);

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger listings_set_updated_at
  before update on listings
  for each row
  execute function set_updated_at();
