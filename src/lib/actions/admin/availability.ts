"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export type AvailabilityActionResult = { error: string } | { ok: true };
export type AddBlockResult = { error: string } | { ok: true; id: string };

const blockSchema = z.object({
  listingId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  reason: z.enum(["maintenance", "owner_stay", "other"]),
  notes: z.string().optional(),
});

export async function addAvailabilityBlock(formData: FormData): Promise<AddBlockResult> {
  await requireAdmin();

  const parsed = blockSchema.safeParse({
    listingId: formData.get("listingId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    reason: formData.get("reason"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the dates." };
  }
  const { listingId, startDate, endDate, reason, notes } = parsed.data;

  if (endDate <= startDate) {
    return { error: "End date must be after the start date." };
  }

  const supabase = createAdminClient();

  // Don't let a block silently orphan an existing guest reservation —
  // require the conflicting booking to be moved or cancelled first.
  const { data: conflicting } = await supabase
    .from("bookings")
    .select("id")
    .eq("listing_id", listingId)
    .not("status", "in", "(cancelled,refunded)")
    .lt("check_in", endDate)
    .gt("check_out", startDate)
    .limit(1);

  if (conflicting && conflicting.length > 0) {
    return { error: "Those dates overlap an existing reservation — move or cancel it first." };
  }

  const { data, error } = await supabase
    .from("availability_blocks")
    .insert({
      listing_id: listingId,
      start_date: startDate,
      end_date: endDate,
      reason,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) return { error: "Could not save this block." };

  revalidatePath(`/admin/properties/${listingId}/edit`);
  return { ok: true, id: data.id };
}

export async function removeAvailabilityBlock(formData: FormData): Promise<AvailabilityActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const listingId = formData.get("listingId") as string;

  const supabase = createAdminClient();
  const { error } = await supabase.from("availability_blocks").delete().eq("id", id);
  if (error) return { error: "Could not remove this block." };

  revalidatePath(`/admin/properties/${listingId}/edit`);
  return { ok: true };
}
