"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditProfileForm({ fullName }: { fullName: string }) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  useEffect(() => {
    if (state?.success) toast.success("Profile updated.");
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Name</Label>
        {/* Keyed so a successful save (which revalidates and changes this
            prop) remounts the field instead of mutating an already-mounted
            uncontrolled input's defaultValue, which Base UI warns about. */}
        <Input key={fullName} id="fullName" name="fullName" defaultValue={fullName} required minLength={2} />
      </div>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
