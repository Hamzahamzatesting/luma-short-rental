import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface TopPage {
  path: string;
  views: number;
}

export interface TrafficOverview {
  pageViews30d: number;
  uniqueVisitors30d: number;
  topPages: TopPage[];
}

/** Backs the admin overview's "Traffic" section — self-hosted, aggregate-only page views. */
export async function getTrafficOverview(days = 30): Promise<TrafficOverview> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const { data, error } = await supabase
    .from("page_views")
    .select("path, visitor_id")
    .gte("created_at", since)
    .limit(50_000);

  if (error || !data) {
    return { pageViews30d: 0, uniqueVisitors30d: 0, topPages: [] };
  }

  const visitors = new Set<string>();
  const countsByPath = new Map<string, number>();
  for (const row of data as Array<{ path: string; visitor_id: string }>) {
    visitors.add(row.visitor_id);
    countsByPath.set(row.path, (countsByPath.get(row.path) ?? 0) + 1);
  }

  const topPages = Array.from(countsByPath.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return { pageViews30d: data.length, uniqueVisitors30d: visitors.size, topPages };
}
