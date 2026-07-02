import "server-only";
import { faqsMock } from "./mock/faqs.mock";
import type { FaqItem } from "./types";

export async function getFaqs(): Promise<FaqItem[]> {
  return faqsMock;
}
