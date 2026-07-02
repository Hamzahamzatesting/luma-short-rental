"use client";

import { useState, useTransition } from "react";
import { cancelBooking } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CancelBookingDialogProps {
  bookingId: string;
  listingTitle: string;
}

export function CancelBookingDialog({ bookingId, listingTitle }: CancelBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("bookingId", bookingId);
      const result = await cancelBooking(null, formData);
      if ("error" in result) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        Cancel Booking
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this reservation?</DialogTitle>
          <DialogDescription>
            {`Your stay at ${listingTitle} will be cancelled and the dates released. This can't be undone.`}
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Keep Booking
          </DialogClose>
          <Button type="button" variant="destructive" disabled={pending} onClick={handleCancel}>
            {pending ? "Cancelling…" : "Yes, Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
