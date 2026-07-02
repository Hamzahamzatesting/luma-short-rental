import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/data/types";

export interface AdminUser {
  id: string;
  email: string | undefined;
  role: ProfileRole;
}

/**
 * Gate for every admin page and every admin Server Action. The proxy only
 * checks that *someone* is signed in before letting a request reach
 * /admin — it doesn't know about roles, and Server Actions aren't covered
 * by the proxy matcher at all, so this must be called at the top of each
 * admin page/layout *and* independently inside every admin Server Action.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return { id: user.id, email: user.email, role: "admin" };
}
