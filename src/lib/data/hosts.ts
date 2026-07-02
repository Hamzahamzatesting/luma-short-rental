import "server-only";
import { hostsMock } from "./mock/hosts.mock";
import type { Host } from "./types";

export async function getHostById(hostId: string): Promise<Host | null> {
  return hostsMock.find((h) => h.id === hostId) ?? null;
}
