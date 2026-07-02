-- Adds an admin role to profiles for the Phase 3 admin dashboard.
-- Kept as a plain text + check constraint (not an enum) so future,
-- more granular roles (property_manager, content_manager, ...) can be
-- added later by just widening the check constraint.

alter table profiles
  add column role text not null default 'guest' check (role in ('guest', 'admin'));

-- "users update own profile" (0005_rls_policies.sql) lets a signed-in user
-- update their own row with no column restriction. Once `role` exists that
-- policy becomes a self-promotion hole. Force role to stay put unless the
-- request comes from the service-role client (which the admin dashboard
-- uses for every write, and which has no auth.uid()/auth.role() of
-- 'authenticated').
create function prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.role() <> 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_self_escalation
  before update on profiles
  for each row
  execute function prevent_role_self_escalation();

-- No bootstrap admin: promote the first admin manually after migrating, e.g.
--   update profiles set role = 'admin' where id = '<user-uuid>';
