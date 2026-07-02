import "server-only";
import { testimonialsMock } from "./mock/testimonials.mock";
import type { Testimonial } from "./types";

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonialsMock;
}
