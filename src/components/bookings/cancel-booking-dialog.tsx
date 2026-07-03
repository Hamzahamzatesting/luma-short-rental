"use client";

import { useState, useTransition } from "react";
import { cancelBooking } from "@/lib/actions/bookings";
import { getCancellationTerms } from "@/lib/cancellation-policy";
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
import type { CancellationPolicy } from "@/lib/data/types";

interface CancelBookingDialogProps {
  bookingId: string;
  listingTitle: string;
  checkIn: string;
  cancellationPolicy?: CancellationPolicy;
}

export function CancelBookingDialog({ bookingId, listingTitle, checkIn, cancellationPolicy }: CancelBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const terms = getCancellationTerms(cancellationPolicy, checkIn);

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
        <p className="text-sm text-foreground">
          Under this property&apos;s cancellation policy, you&apos;re eligible for a{" "}
          <span className="font-medium">{terms.summary.toLowerCase()}</span>.
        </p>
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
