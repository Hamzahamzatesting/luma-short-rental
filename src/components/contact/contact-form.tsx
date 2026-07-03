"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, undefined);

  if (state?.success) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="font-serif text-xl text-foreground">Message sent</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for reaching out — our concierge team will reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required minLength={2} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} required minLength={10} />
      </div>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending} size="lg" className="self-start">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
