-- Backs src/lib/rate-limit.ts: a DB-backed sliding-window limiter for
-- login, signup, password-reset, and booking-creation attempts. No Redis
-- is provisioned for this project, so Postgres is the pragmatic real
-- store rather than an in-memory counter that wouldn't survive across
-- serverless invocations.

create table rate_limit_attempts (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_attempts_lookup_idx
  on rate_limit_attempts (identifier, action, created_at);

alter table rate_limit_attempts enable row level security;
-- No policies — only the service-role client (src/lib/rate-limit.ts) ever
-- touches this table; it must never be reachable from the anon/authenticated
-- client, or a caller could clear their own rate-limit history.
