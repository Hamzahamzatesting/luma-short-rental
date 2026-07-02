"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** UI-only in Phase 1 — no subscriber persistence until the backend lands. */
export function NewsletterForm() {
  return (
    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <Input
        type="email"
        placeholder="Email address"
        className="border-ivory/20 bg-transparent text-ivory placeholder:text-ivory/40"
      />
      <Button type="submit" variant="gold-outline" size="default">
        Join
      </Button>
    </form>
  );
}
