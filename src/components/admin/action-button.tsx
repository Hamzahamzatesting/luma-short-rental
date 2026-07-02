"use client";

import { useTransition, type ComponentProps, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ActionResult = { error: string } | { ok: true };

interface ActionButtonProps extends Omit<ComponentProps<typeof Button>, "onClick"> {
  action: (formData: FormData) => Promise<ActionResult>;
  formData: Record<string, string>;
  successMessage?: string;
  children: ReactNode;
}

/** One-click server-action trigger (archive, publish, feature, duplicate) with toast feedback. */
export function ActionButton({
  action,
  formData,
  successMessage,
  children,
  disabled,
  ...props
}: ActionButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      {...props}
      disabled={disabled || pending}
      onClick={() => {
        startTransition(async () => {
          const fd = new FormData();
          for (const [key, value] of Object.entries(formData)) fd.set(key, value);
          const result = await action(fd);
          if ("error" in result) {
            toast.error(result.error);
          } else if (successMessage) {
            toast.success(successMessage);
          }
        });
      }}
    >
      {children}
    </Button>
  );
}
