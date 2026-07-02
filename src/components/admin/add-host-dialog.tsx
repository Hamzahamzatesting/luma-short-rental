"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createHost, type CreateHostState } from "@/lib/actions/admin/hosts";

export function AddHostDialog({ onCreated }: { onCreated: (host: { id: string; name: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<CreateHostState, FormData>(createHost, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state) {
      onCreated(state.host);
      setOpen(false);
      formRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Plus />
        New host
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a host</DialogTitle>
          <DialogDescription>Creates a host record you can assign to any property.</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-host-name">Name</Label>
            <Input id="new-host-name" name="name" placeholder="e.g. Yasmine El Fassi" required minLength={2} autoFocus />
          </div>
          {state && "error" in state ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <Button type="submit" disabled={pending} className="self-end">
            {pending ? "Adding…" : "Add host"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
