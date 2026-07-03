"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActionButton } from "@/components/admin/action-button";
import { addAvailabilityBlock, removeAvailabilityBlock } from "@/lib/actions/admin/availability";
import type { AvailabilityBlock, BlockReason } from "@/lib/data/admin/availability";

const REASON_LABELS: Record<BlockReason, string> = {
  maintenance: "Maintenance",
  owner_stay: "Owner stay",
  other: "Other",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function AvailabilityBlocksManager({
  listingId,
  blocks: initialBlocks,
}: {
  listingId: string;
  blocks: AvailabilityBlock[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [pending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState<BlockReason>("maintenance");
  const [notes, setNotes] = useState("");

  // A plain <div> (not <form>) — this lives inside the property edit page's
  // outer <form>, and HTML doesn't allow nested forms (the browser silently
  // drops the inner one, so its submit button would submit the outer form
  // instead). Fields are controlled and posted as FormData by hand.
  function handleAdd() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("listingId", listingId);
      fd.set("startDate", startDate);
      fd.set("endDate", endDate);
      fd.set("reason", reason);
      fd.set("notes", notes);
      const result = await addAvailabilityBlock(fd);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Block added");
      setBlocks((prev) => [
        ...prev,
        { id: result.id, listingId, startDate, endDate, reason, notes: notes || undefined, createdAt: new Date().toISOString() },
      ]);
      setStartDate("");
      setEndDate("");
      setReason("maintenance");
      setNotes("");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Block dates</p>
        <p className="mb-3 text-xs text-muted-foreground">
          Prevents guests from booking these dates. Existing reservations must be moved or cancelled first.
        </p>
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startDate">Start</Label>
            <Input
              id="startDate"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="endDate">End</Label>
            <Input
              id="endDate"
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Select value={reason} onValueChange={(v) => setReason((v as BlockReason) ?? "maintenance")}>
              <SelectTrigger id="reason" className="w-full">
                <SelectValue>
                  {(value: BlockReason | null) => (value ? REASON_LABELS[value] : "")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="owner_stay">Owner stay</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-end gap-1.5 sm:col-span-1">
            <Button
              type="button"
              disabled={pending || !startDate || !endDate}
              variant="outline"
              onClick={handleAdd}
            >
              {pending ? "Adding…" : "Add block"}
            </Button>
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-4">
            <Label htmlFor="notes">Notes (internal only)</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="e.g. Pool retiling, back Tuesday"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {blocks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No blocked dates.</p>
        ) : (
          blocks.map((block) => (
            <div key={block.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground">
                    {formatDate(block.startDate)} &ndash; {formatDate(block.endDate)}
                  </p>
                  <Badge variant="outline" className="uppercase tracking-wide">
                    {REASON_LABELS[block.reason]}
                  </Badge>
                </div>
                {block.notes ? <p className="text-xs text-muted-foreground">{block.notes}</p> : null}
              </div>
              <ActionButton
                action={removeAvailabilityBlock}
                formData={{ id: block.id, listingId }}
                successMessage="Removed"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                Remove
              </ActionButton>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
