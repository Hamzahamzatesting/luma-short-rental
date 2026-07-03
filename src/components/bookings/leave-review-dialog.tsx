"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";

export function LeaveReviewDialog({ bookingId, listingTitle }: { bookingId: string; listingTitle: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [state, formAction, pending] = useActionState(submitReview, undefined);

  // Close the dialog on success — adjusted during render (not an effect) so
  // it takes effect before the browser paints the stale, still-open dialog.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state && "ok" in state) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Leave a review</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How was your stay?</DialogTitle>
          <DialogDescription>{listingTitle} — visible after we approve it.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="bookingId" value={bookingId} />
          <input type="hidden" name="rating" value={rating} />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className="p-0.5"
              >
                <Star className={cn("size-6", n <= rating ? "fill-gold text-gold" : "text-muted-foreground")} />
              </button>
            ))}
          </div>
          <Textarea name="comment" rows={4} placeholder="What made your stay memorable?" required minLength={10} />
          {state && "error" in state ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting…" : "Submit review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
