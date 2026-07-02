import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anon-key Supabase client with no cookie/session handling — safe to call
 * from anywhere, including build-time contexts like generateStaticParams
 * where next/headers' cookies() is unavailable. Use this for public,
 * anonymously-readable catalog data (listings, destinations, reviews, etc).
 * For anything scoped to the signed-in user (bookings, profile), use
 * src/lib/supabase/server.ts instead.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
