import type { Testimonial } from "../types";
import { avatarFor } from "./images";

export const testimonialsMock: Testimonial[] = [
  {
    id: "testimonial-1",
    authorName: "Charlotte Reed",
    authorLocation: "London, UK",
    avatarUrl: avatarFor("women", 61),
    quote:
      "LUMA doesn't feel like booking a rental — it feels like being handed the keys to someone's most beautiful home.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    authorName: "Marcus Lindqvist",
    authorLocation: "Stockholm, Sweden",
    avatarUrl: avatarFor("men", 62),
    quote:
      "The concierge arranged everything before we even landed. Effortless, from the first email to checkout.",
    rating: 5,
  },
  {
    id: "testimonial-3",
    authorName: "Amira Haddad",
    authorLocation: "Dubai, UAE",
    avatarUrl: avatarFor("women", 63),
    quote:
      "Every property we've stayed in has had a real point of view. Nothing generic, nothing rushed.",
    rating: 4.9,
  },
  {
    id: "testimonial-4",
    authorName: "Thomas Berger",
    authorLocation: "Zurich, Switzerland",
    avatarUrl: avatarFor("men", 64),
    quote:
      "Privacy, design, and a level of service I've only otherwise found at five-star hotels.",
    rating: 5,
  },
  {
    id: "testimonial-5",
    authorName: "Isabelle Laurent",
    authorLocation: "Paris, France",
    avatarUrl: avatarFor("women", 65),
    quote:
      "We've booked LUMA three times now for family trips. It's become the standard we compare everything else to.",
    rating: 4.95,
  },
  {
    id: "testimonial-6",
    authorName: "Daniel Osei",
    authorLocation: "Toronto, Canada",
    avatarUrl: avatarFor("men", 66),
    quote:
      "Quietly extraordinary. The kind of stay that makes the destination feel entirely your own.",
    rating: 5,
  },
];
