"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpWithPassword, signInWithGoogle } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpWithPassword, undefined);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" autoComplete="name" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required />
        </div>

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        {state?.message && <p className="text-sm text-gold">{state.message}</p>}

        <Button type="submit" size="xl" disabled={pending} className="mt-2">
          {pending ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-label text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={signInWithGoogle}>
        <Button type="submit" variant="outline" size="xl" className="w-full">
          Continue with Google
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-gold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
