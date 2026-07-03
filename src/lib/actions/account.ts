"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type DeleteAccountState = { error: string } | undefined;
export type UpdateProfileState = { error?: string; success?: boolean } | undefined;

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
});

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const parsed = profileSchema.safeParse({ fullName: formData.get("fullName") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/account");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);

  if (error) {
    return { error: "Something went wrong saving your profile. Please try again." };
  }

  revalidatePath("/account");
  return { success: true };
}

export async function deleteAccount(
  _prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const confirmation = formData.get("confirmation");
  if (confirmation !== "DELETE") {
    return { error: 'Type "DELETE" to confirm.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/account");

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { error: "Something went wrong deleting your account. Please try again." };
  }

  await supabase.auth.signOut();
  redirect("/");
}
