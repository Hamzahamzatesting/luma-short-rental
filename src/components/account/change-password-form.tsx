"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <p className="text-xs text-muted-foreground">You&apos;ll be signed out and asked to sign back in.</p>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" variant="outline" disabled={pending} className="self-start">
        {pending ? "Updating…" : "Change password"}
      </Button>
    </form>
  );
}
