export type Currency = "MAD" | "EUR" | "USD";

export interface Money {
  amount: number;
  currency: Currency;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string; // lucide-react icon name
}

export interface Host {
  id: string;
  name: string;
  avatarUrl: string;
  responseRate: number;
  responseTime: string;
  joinedYear: number;
  bio?: string;
}

export interface Review {
  id: string;
  listingId: string;
  authorName: string;
  authorAvatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  imageUrl: string;
  listingCount: number;
  blurb?: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface NearbyAttraction {
  id: string;
  name: string;
  distanceKm: number;
  category: string;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  city: string;
  country: string;
  neighborhood?: string;
  location: GeoPoint;
  images: string[];
  pricePerNight: Money;
  weekendPricePerNight?: Money;
  cleaningFee: Money;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  amenityIds: string[];
  luxuryScore: number;
  isInstantBook: boolean;
  isFeatured: boolean;
  isPetFriendly: boolean;
  hasPool: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  hasSeaView: boolean;
  shortDescription: string;
  description: string;
  houseRules: string[];
  checkInTime: string;
  checkOutTime: string;
  hostId: string;
  rating: number;
  reviewCount: number;
  nearbyAttractions: NearbyAttraction[];
  blockedDates: string[];
  createdAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorLocation?: string;
  avatarUrl?: string;
  quote: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popularity"
  | "luxury";

export interface SearchFilters {
  destinationSlug?: string;
  query?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenityIds?: string[];
  petFriendly?: boolean;
  seaView?: boolean;
  instantBookOnly?: boolean;
  sort?: SortOption;
}
