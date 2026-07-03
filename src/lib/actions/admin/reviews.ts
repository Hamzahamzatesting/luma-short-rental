"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ReviewStatus } from "@/lib/data/types";

export type ReviewActionResult = { error: string } | { ok: true };

const SETTABLE_STATUSES: ReviewStatus[] = ["pending", "approved", "hidden"];

export async function setReviewStatus(formData: FormData): Promise<ReviewActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const status = formData.get("status") as ReviewStatus;
  if (!SETTABLE_STATUSES.includes(status)) return { error: "Not a valid status." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
  if (error) return { error: "Could not update this review." };

  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function toggleReviewFeatured(formData: FormData): Promise<ReviewActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const isFeatured = formData.get("isFeatured") === "true";

  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").update({ is_featured: isFeatured }).eq("id", id);
  if (error) return { error: "Could not update the featured state." };

  revalidatePath("/admin/reviews");
  return { ok: true };
}
