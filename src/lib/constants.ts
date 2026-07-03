export const SITE_NAME = "LUMA";
export const TAGLINE = "Curated Stays. Extraordinary Moments.";

export const NAV_LINKS = [
  { label: "Destinations", href: "/search" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
] as const;

export const FOOTER_LINKS = {
  explore: [
    { label: "Search Stays", href: "/search" },
    { label: "Destinations", href: "/#destinations" },
    { label: "Experiences", href: "/#experience" },
  ],
  company: [
    { label: "About LUMA", href: "/#about" },
    { label: "Concierge", href: "/#why-luma" },
    { label: "Trust & Safety", href: "/#faq" },
  ],
  support: [
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const AMENITIES = [
  { id: "pool", label: "Pool", icon: "Waves" },
  { id: "wifi", label: "WiFi", icon: "Wifi" },
  { id: "parking", label: "Parking", icon: "SquareParking" },
  { id: "kitchen", label: "Full Kitchen", icon: "ChefHat" },
  { id: "spa", label: "Spa & Hammam", icon: "Flame" },
  { id: "gym", label: "Fitness Room", icon: "Dumbbell" },
  { id: "fireplace", label: "Fireplace", icon: "Flame" },
  { id: "rooftop", label: "Rooftop Terrace", icon: "Building2" },
  { id: "concierge", label: "Concierge", icon: "BellRing" },
  { id: "air-conditioning", label: "Air Conditioning", icon: "Snowflake" },
] as const;

export const WHY_LUMA = [
  {
    id: "curated-homes",
    icon: "House",
    title: "Curated Homes",
    description: "Every residence is personally selected for design, comfort and character.",
  },
  {
    id: "premium-locations",
    icon: "MapPin",
    title: "Premium Locations",
    description: "From medina riads to coastal villas, always in the most remarkable settings.",
  },
  {
    id: "concierge",
    icon: "Headset",
    title: "24/7 Concierge",
    description: "A dedicated team on call for every request, before and during your stay.",
  },
  {
    id: "exceptional-stays",
    icon: "Sparkle",
    title: "Exceptional Stays",
    description: "Thoughtful details and effortless service, from arrival to departure.",
  },
  {
    id: "secure-booking",
    icon: "ShieldCheck",
    title: "Secure Booking",
    description: "Transparent pricing and protected reservations, every time.",
  },
] as const;
