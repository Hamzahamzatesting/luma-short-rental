"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cancelBookingAdmin,
  confirmBooking,
  rejectBooking,
  updateBookingDates,
  updateBookingStatus,
  addBookingNote,
} from "@/lib/actions/admin/bookings";
import type { AdminBookingDetail } from "@/lib/data/admin/bookings";

type ActionResult = { error: string } | { ok: true };

function useAction(action: (formData: FormData) => Promise<ActionResult>, successMessage?: string) {
  const [pending, startTransition] = useTransition();
  const run = (formData: FormData) =>
    startTransition(async () => {
      const result = await action(formData);
      if ("error" in result) toast.error(result.error);
      else if (successMessage) toast.success(successMessage);
    });
  return { pending, run };
}

export function BookingQuickActions({ booking }: { booking: AdminBookingDetail }) {
  const confirm = useAction(confirmBooking, "Confirmed — guest notified by email");
  const reject = useAction(rejectBooking, "Rejected — guest notified by email");
  const cancel = useAction(cancelBookingAdmin, "Cancelled — guest notified by email");

  const canConfirm = booking.status === "pending" || booking.status === "awaiting_payment";
  const canCancel = !["cancelled", "refunded", "completed"].includes(booking.status);

  return (
    <div className="flex flex-wrap gap-2">
      {canConfirm ? (
        <Button disabled={confirm.pending} onClick={() => confirm.run(makeFormData({ id: booking.id }))}>
          Confirm
        </Button>
      ) : null}
      {canConfirm ? (
        <Button
          variant="destructive"
          disabled={reject.pending}
          onClick={() => reject.run(makeFormData({ id: booking.id }))}
        >
          Reject
        </Button>
      ) : null}
      {canCancel && !canConfirm ? (
        <Button
          variant="destructive"
          disabled={cancel.pending}
          onClick={() => cancel.run(makeFormData({ id: booking.id }))}
        >
          Cancel booking
        </Button>
      ) : null}
      <Button variant="outline" onClick={() => window.print()}>
        Print reservation
      </Button>
    </div>
  );
}

function makeFormData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

const MANUAL_STATUSES = [
  "pending",
  "awaiting_payment",
  "confirmed",
  "checked_in",
  "checked_out",
  "refunded",
  "completed",
] as const;

export function BookingStatusControl({ booking }: { booking: AdminBookingDetail }) {
  const { pending, run } = useAction(updateBookingStatus, "Status updated");

  return (
    <form
      action={(formData) => run(formData)}
      className="flex items-end gap-2"
    >
      <input type="hidden" name="id" value={booking.id} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Set status</Label>
        <Select name="status" defaultValue={booking.status}>
          <SelectTrigger id="status" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MANUAL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" variant="outline" disabled={pending}>
        Update
      </Button>
    </form>
  );
}

export function BookingDatesForm({ booking }: { booking: AdminBookingDetail }) {
  const { pending, run } = useAction(updateBookingDates, "Dates updated");

  return (
    <form action={(formData) => run(formData)} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="id" value={booking.id} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkIn">Check-in</Label>
        <Input id="checkIn" name="checkIn" type="date" defaultValue={booking.checkIn} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkOut">Check-out</Label>
        <Input id="checkOut" name="checkOut" type="date" defaultValue={booking.checkOut} />
      </div>
      <Button type="submit" variant="outline" disabled={pending}>
        Move booking
      </Button>
    </form>
  );
}

export function BookingNoteForm({ booking }: { booking: AdminBookingDetail }) {
  const { pending, run } = useAction(addBookingNote, "Note saved");

  return (
    <form action={(formData) => run(formData)} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={booking.id} />
      <Textarea name="note" rows={3} defaultValue={booking.adminNotes} placeholder="Internal note, not visible to the guest…" />
      <Button type="submit" variant="outline" size="sm" className="self-end" disabled={pending}>
        Save note
      </Button>
    </form>
  );
}
