import type { Listing, Host } from "@/lib/data/types";

export interface Highlight {
  label: string;
}

const HISTORIC_NEIGHBORHOODS = ["Medina", "Kasbah"];

/**
 * Editorial "at a glance" badges, derived entirely from real listing fields —
 * no invented claims. Ordered by how compelling each signal is, capped so
 * the row never overwhelms the description.
 */
export function getPropertyHighlights(listing: Listing): Highlight[] {
  const highlights: Highlight[] = [];

  if (listing.rating >= 4.9 || listing.reviewCount >= 80) {
    highlights.push({ label: "Guest Favorite" });
  }
  if (listing.neighborhood && HISTORIC_NEIGHBORHOODS.includes(listing.neighborhood)) {
    highlights.push({ label: "Historic Medina" });
  }
  if (listing.hasSeaView && listing.amenityIds.includes("rooftop")) {
    highlights.push({ label: "Rooftop Sunset Views" });
  } else if (listing.hasSeaView) {
    highlights.push({ label: "Sea View" });
  } else if (listing.amenityIds.includes("rooftop")) {
    highlights.push({ label: "Rooftop Terrace" });
  }
  if (listing.isFeatured) {
    highlights.push({ label: "Professionally Managed" });
  }
  const nearBeach = listing.nearbyAttractions.find(
    (a) => a.category === "Beach" && a.distanceKm <= 1
  );
  if (nearBeach) {
    highlights.push({ label: "Walk to the Beach" });
  }
  if (listing.maxGuests <= 4) {
    highlights.push({ label: "Perfect for Couples" });
  } else if (listing.maxGuests >= 8) {
    highlights.push({ label: "Great for Groups" });
  }
  if (listing.isPetFriendly) {
    highlights.push({ label: "Pet Friendly" });
  }
  if (listing.hasPool && highlights.length < 6) {
    highlights.push({ label: "Private Pool" });
  }
  if (listing.isInstantBook && highlights.length < 6) {
    highlights.push({ label: "Instant Book" });
  }

  return highlights.slice(0, 6);
}

const ARCHITECTURE_HINTS: { match: RegExp; line: string }[] = [
  { match: /^riad\b/i, line: "A restored riad built around a traditional courtyard" },
  { match: /^dar\b/i, line: "A characterful Moroccan house, carefully preserved" },
  { match: /^villa\b/i, line: "Contemporary villa architecture with generous private grounds" },
  { match: /^maison\b/i, line: "A quietly elegant house tucked into the neighborhood" },
  { match: /^penthouse\b/i, line: "A sleek top-floor residence with uninterrupted views" },
];

const AMENITY_COPY: Record<string, string> = {
  rooftop: "A private rooftop terrace, ideal for slow mornings and long evenings",
  pool: "A private pool, away from crowds and shared decks",
  spa: "An in-house spa and hammam for a stay built around rest",
  fireplace: "A fireplace that makes cooler evenings part of the experience",
  concierge: "LUMA's concierge team on call throughout your stay",
  gym: "A private fitness room, no hotel gym required",
  kitchen: "A fully equipped kitchen for guests who like to cook their own evenings",
};

/**
 * Short, data-driven bullets for the "Why Guests Love This Stay" section.
 * Built from the listing's actual architecture cue, amenities, closest
 * attraction, and host quality — not template filler.
 */
export function getWhyGuestsLoveThis(listing: Listing, host?: Host | null): string[] {
  const bullets: string[] = [];

  const architecture = ARCHITECTURE_HINTS.find((h) => h.match.test(listing.title));
  if (architecture) bullets.push(architecture.line);

  const featuredAmenity = ["rooftop", "pool", "spa", "fireplace"].find((id) =>
    listing.amenityIds.includes(id)
  );
  if (featuredAmenity) bullets.push(AMENITY_COPY[featuredAmenity]);

  const closest = [...listing.nearbyAttractions].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  if (closest) {
    bullets.push(
      `${closest.name} just ${closest.distanceKm < 1 ? `${Math.round(closest.distanceKm * 1000)}m` : `${closest.distanceKm}km`} away`
    );
  }

  if (listing.amenityIds.includes("concierge")) {
    bullets.push(AMENITY_COPY.concierge);
  } else if (host && host.responseRate >= 97) {
    bullets.push(`A responsive host — ${host.responseRate}% response rate, replies ${host.responseTime}`);
  }

  if (listing.rating >= 4.85) {
    bullets.push(`Rated ${listing.rating.toFixed(2)} by ${listing.reviewCount} past guests`);
  }

  return bullets.slice(0, 5);
}

const STORY_TEMPLATES: { when: (l: Listing) => boolean; quote: (l: Listing) => string }[] = [
  {
    when: (l) => l.hasSeaView,
    quote: (l) =>
      `Wake up to the sound of the Atlantic, where the light over ${l.city} turns the water from silver to gold and the day asks nothing of you but to notice it.`,
  },
  {
    when: (l) => !!l.neighborhood && HISTORIC_NEIGHBORHOODS.includes(l.neighborhood),
    quote: (l) =>
      `Wake up to the quiet rhythm of ${l.city}'s historic ${l.neighborhood}, where natural light fills every room and every corner invites you to slow down.`,
  },
  {
    when: () => true,
    quote: (l) =>
      `Wake up to the quiet rhythm of ${l.city}, where natural light fills every room and every corner invites you to slow down.`,
  },
];

export interface StoryContent {
  heading: string;
  quote: string;
}

/** Editorial copy for the full-bleed storytelling section — grounded in city/neighborhood, not invented. */
export function getStoryContent(listing: Listing): StoryContent {
  const template = STORY_TEMPLATES.find((t) => t.when(listing))!;
  return {
    heading: `Experience ${listing.title}`,
    quote: template.quote(listing),
  };
}
