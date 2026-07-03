import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RateLimitConfig {
  max: number;
  windowMinutes: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMinutes?: number;
}

/**
 * DB-backed sliding-window limiter — no Redis is provisioned for this
 * project, so a Postgres table is the pragmatic real store (an in-memory
 * counter wouldn't survive across serverless invocations). Fails open on
 * a DB error: a rate-limit outage should never be the reason a real user
 * can't sign in.
 */
export async function checkRateLimit(
  identifier: string,
  action: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const supabase = createAdminClient();
  const windowStart = new Date(Date.now() - config.windowMinutes * 60_000).toISOString();

  const { count, error: countError } = await supabase
    .from("rate_limit_attempts")
    .select("*", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("action", action)
    .gte("created_at", windowStart);

  if (countError) return { allowed: true };
  if ((count ?? 0) >= config.max) {
    return { allowed: false, retryAfterMinutes: config.windowMinutes };
  }

  await supabase.from("rate_limit_attempts").insert({ identifier, action });
  return { allowed: true };
}

export function rateLimitMessage(action: string, result: RateLimitResult): string {
  const minutes = result.retryAfterMinutes ?? 15;
  return `Too many ${action} attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}
