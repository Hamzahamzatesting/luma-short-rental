-- Records what refund percentage a cancellation qualified for under the
-- listing's cancellation policy at the moment it was cancelled — informational
-- until real payment processing exists, so an admin has the number on hand
-- when issuing a manual refund outside the system.

alter table bookings
  add column refund_percent int check (refund_percent between 0 and 100);
