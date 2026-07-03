-- Self-hosted, aggregate-only page view tracking — there was previously no
-- way to see which pages get traffic or how many distinct visitors the site
-- gets. No third-party analytics script is used; this is a single append-only
-- table written by the tracking server action and read by the admin overview.

create table page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  visitor_id uuid not null,
  created_at timestamptz not null default now()
);

create index page_views_created_at_idx on page_views (created_at);
create index page_views_path_idx on page_views (path);

alter table page_views enable row level security;
-- No policies — written and read only via the service-role client (the
-- tracking action and the admin dashboard query), same pattern as
-- rate_limit_attempts in 0014.
