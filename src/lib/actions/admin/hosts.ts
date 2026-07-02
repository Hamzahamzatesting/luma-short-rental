"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateHostState =
  | { error: string }
  | { ok: true; host: { id: string; name: string } }
  | undefined;

const hostSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export async function createHost(
  _prevState: CreateHostState,
  formData: FormData
): Promise<CreateHostState> {
  await requireAdmin();

  const parsed = hostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please enter a name." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("hosts")
    .insert({
      id: `host-${crypto.randomUUID()}`,
      name: parsed.data.name,
      // Neutral placeholder — already-whitelisted image host, no
      // next.config.ts change needed. Admins can swap it in later once a
      // dedicated host-management page exists.
      avatar_url: "https://randomuser.me/api/portraits/lego/1.jpg",
      response_rate: 100,
      response_time: "within an hour",
      joined_year: new Date().getFullYear(),
    })
    .select("id, name")
    .single();

  if (error) {
    return { error: "Could not create host. Please try again." };
  }

  revalidatePath("/admin/properties");
  return { ok: true, host: data };
}
