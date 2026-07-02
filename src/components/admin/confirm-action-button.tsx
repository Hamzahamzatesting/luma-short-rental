"use client";

import { useTransition, type ReactElement, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ActionResult = { error: string } | { ok: true };

interface ConfirmActionButtonProps {
  action: (formData: FormData) => Promise<ActionResult>;
  formData: Record<string, string>;
  title: string;
  description: string;
  confirmLabel?: string;
  successMessage?: string;
  trigger: ReactNode;
}

/** Destructive server-action trigger (delete) gated behind a confirmation dialog. */
export function ConfirmActionButton({
  action,
  formData,
  title,
  description,
  confirmLabel = "Confirm",
  successMessage,
  trigger,
}: ConfirmActionButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger as ReactElement} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            render={
              <Button
                variant="destructive"
                disabled={pending}
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
              />
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
