-- Lets admins moderate reviews instead of every seeded/submitted review
-- being permanently and unconditionally public.

alter table reviews
  add column status text not null default 'approved'
    check (status in ('pending', 'approved', 'hidden')),
  add column is_featured boolean not null default false;

-- Default 'approved' so the 84 existing seeded reviews stay visible;
-- future guest-submitted reviews (a later feature) would default to
-- 'pending' at the application layer instead.

create index reviews_status_idx on reviews (status);
