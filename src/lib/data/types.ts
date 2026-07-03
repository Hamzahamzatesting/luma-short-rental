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

export type ReviewStatus = "pending" | "approved" | "hidden";

export interface Review {
  id: string;
  listingId: string;
  authorName: string;
  authorAvatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
  isFeatured: boolean;
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

export type ListingStatus = "draft" | "published" | "archived";

export type CancellationPolicy = "flexible" | "moderate" | "strict";

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
  videos: string[];
  pricePerNight: Money;
  weekendPricePerNight?: Money;
  cleaningFee: Money;
  securityDeposit?: Money;
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
  status: ListingStatus;
  cancellationPolicy?: CancellationPolicy;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
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

export type BookingStatus =
  | "pending"
  | "awaiting_payment"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "refunded"
  | "completed";

export interface Booking {
  id: string;
  listingId: string;
  listingSlug: string;
  listingTitle: string;
  listingImage: string;
  listingCity: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNightSnapshot: Money;
  cleaningFeeSnapshot: Money;
  serviceFee: Money;
  total: Money;
  status: BookingStatus;
  adminNotes?: string;
  refundPercent?: number;
  listingCancellationPolicy?: CancellationPolicy;
  createdAt: string;
  updatedAt: string;
}

export type ProfileRole = "guest" | "admin";

export interface Profile {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  role: ProfileRole;
  createdAt: string;
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
