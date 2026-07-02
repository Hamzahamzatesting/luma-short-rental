import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Testimonial } from "./types";

interface TestimonialRow {
  id: string;
  author_name: string;
  author_location: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number;
}

function mapTestimonialRow(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    authorName: row.author_name,
    authorLocation: row.author_location ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    quote: row.quote,
    rating: row.rating,
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("testimonials").select("*");
  return (data ?? []).map(mapTestimonialRow);
}
