-- Public media bucket for listing photos/videos, uploaded from the admin
-- dashboard's browser client (not the service-role client, so this relies
-- on real RLS policies rather than server-side bypass).

create function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

insert into storage.buckets (id, name, public)
values ('listing-media', 'listing-media', true)
on conflict (id) do nothing;

create policy "public read listing media" on storage.objects
  for select using (bucket_id = 'listing-media');

create policy "admins upload listing media" on storage.objects
  for insert with check (bucket_id = 'listing-media' and is_admin());

create policy "admins update listing media" on storage.objects
  for update using (bucket_id = 'listing-media' and is_admin());

create policy "admins delete listing media" on storage.objects
  for delete using (bucket_id = 'listing-media' and is_admin());
