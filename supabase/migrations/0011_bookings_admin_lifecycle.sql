-- Extends the booking lifecycle for admin management (0001 only defined
-- pending/confirmed/cancelled for the guest-facing flow) and adds an
-- admin notes field + updated_at tracking.
--
-- Each new enum value is its own statement and none are referenced later
-- in this same migration/transaction — Postgres forbids using a
-- just-added enum value before the transaction that added it commits.

alter type booking_status add value if not exists 'awaiting_payment';
alter type booking_status add value if not exists 'checked_in';
alter type booking_status add value if not exists 'checked_out';
alter type booking_status add value if not exists 'refunded';
alter type booking_status add value if not exists 'completed';

alter table bookings
  add column admin_notes text,
  add column updated_at timestamptz not null default now();

create trigger bookings_set_updated_at
  before update on bookings
  for each row
  execute function set_updated_at();
