import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Host } from "./types";

interface HostRow {
  id: string;
  name: string;
  avatar_url: string;
  response_rate: number;
  response_time: string;
  joined_year: number;
  bio: string | null;
}

function mapHostRow(row: HostRow): Host {
  return {
    id: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    responseRate: row.response_rate,
    responseTime: row.response_time,
    joinedYear: row.joined_year,
    bio: row.bio ?? undefined,
  };
}

export async function getHostById(hostId: string): Promise<Host | null> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("hosts").select("*").eq("id", hostId).maybeSingle();
  return data ? mapHostRow(data) : null;
}
