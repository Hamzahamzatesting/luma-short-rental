"use server";

import { createClient } from "@/lib/supabase/server";

export type FavoriteActionResult = { error: string } | { ok: true };

export async function setFavorite(listingId: string, favorited: boolean): Promise<FavoriteActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to save favorites." };

  const { error } = favorited
    ? await supabase.from("favorites").insert({ user_id: user.id, listing_id: listingId })
    : await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);

  if (error && error.code !== "23505") {
    return { error: "Something went wrong. Please try again." };
  }
  return { ok: true };
}
