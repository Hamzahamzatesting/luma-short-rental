import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { FaqItem } from "./types";

interface FaqRow {
  id: string;
  question: string;
  answer: string;
}

function mapFaqRow(row: FaqRow): FaqItem {
  return { id: row.id, question: row.question, answer: row.answer };
}

export async function getFaqs(): Promise<FaqItem[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order");
  return (data ?? []).map(mapFaqRow);
}
