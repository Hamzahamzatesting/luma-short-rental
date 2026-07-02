-- Account deletion (src/lib/actions/account.ts) calls the service-role
-- admin API to delete the auth.users row directly. bookings.user_id had no
-- ON DELETE behavior (defaults to NO ACTION), which would reject that
-- delete for any user with booking history. Cascade it, matching the
-- existing profiles -> auth.users cascade from 0004_profiles_and_auth_trigger.sql.

alter table bookings drop constraint bookings_user_id_fkey;
alter table bookings add constraint bookings_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
