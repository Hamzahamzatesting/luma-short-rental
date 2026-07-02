-- Lets you grant admin access ahead of time by email, so creating the
-- account (via Authentication -> Add User in the Supabase dashboard, or
-- normal signup) is the only step — no follow-up "UPDATE profiles..." needed.
--
-- Locked down by RLS with zero policies: only the service-role client (or
-- the SQL editor) can read/write it, never the anon/authenticated API.

create table admin_emails (
  email text primary key,
  added_at timestamptz not null default now()
);

alter table admin_emails enable row level security;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    case
      when exists (select 1 from public.admin_emails where lower(email) = lower(new.email))
        then 'admin'
      else 'guest'
    end
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- To grant admin access to a not-yet-created account:
--   insert into admin_emails (email) values ('someone@example.com');
-- Then create that user (dashboard or signup) — their profile is inserted
-- with role = 'admin' directly, since the trigger above checks this table.
--
-- For an account that already exists, the allowlist has no retroactive
-- effect (the trigger only runs on new auth.users rows) — promote it the
-- same way as before:
--   update profiles set role = 'admin' where id = '<user-uuid>';
