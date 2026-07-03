"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "@/lib/actions/track";

const STORAGE_KEY = "luma_visitor_id";

function getVisitorId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

/**
 * Self-hosted, aggregate-only page view tracker — no third-party script,
 * no cross-site tracking. Skips /admin so internal traffic doesn't skew
 * guest-facing numbers.
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    recordPageView(pathname, getVisitorId()).catch(() => {});
  }, [pathname]);

  return null;
}
