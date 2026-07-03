"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Fire-and-forget analytics beacon — called from every route change on the
 * public site (see AnalyticsBeacon). Never throws: a broken pageview ping
 * should never be visible to a real visitor.
 */
export async function recordPageView(path: string, visitorId: string): Promise<void> {
  if (typeof path !== "string" || !path.startsWith("/") || path.length > 300) return;
  if (typeof visitorId !== "string" || !UUID_RE.test(visitorId)) return;

  try {
    const supabase = createAdminClient();
    await supabase.from("page_views").insert({ path, visitor_id: visitorId });
  } catch {
    // Analytics is best-effort — a failed write here must never affect the page.
  }
}
