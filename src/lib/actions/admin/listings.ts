"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getListingByIdAdmin } from "@/lib/data/admin/listings";

export type SubmittedValues = Record<string, string | string[]>;
export type ListingFormState = { error?: string; values?: SubmittedValues } | undefined;
export type ListingActionResult = { error: string } | { ok: true };

/**
 * React resets a `<form action>`'s uncontrolled fields on every submission —
 * including ones that come back with a validation error — so the action
 * echoes back what was submitted and the form re-hydrates from it instead
 * of silently losing everything the admin just typed.
 */
function formDataToValues(formData: FormData): SubmittedValues {
  const out: SubmittedValues = {};
  for (const key of new Set(formData.keys())) {
    const all = formData.getAll(key).map(String);
    out[key] = all.length > 1 ? all : all[0];
  }
  return out;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Left-blank optional fields submit as "" (not absent) — coerced through
// z.coerce.number() that becomes 0 (failing .positive()/.min()), and
// z.enum().optional() rejects "" outright since it isn't undefined. Strip
// empty strings before the real schema runs so "blank" reads as "omitted".
const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);
function optionalNumber<S extends { optional: () => z.ZodTypeAny }>(schema: S) {
  return z.preprocess(emptyToUndefined, schema.optional());
}
const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
  z.preprocess(emptyToUndefined, z.enum(values).optional());

const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  destinationId: z.string().min(1, "Choose a destination."),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
  neighborhood: z.string().optional(),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  priceAmount: z.coerce.number().positive("Nightly price must be greater than 0."),
  weekendPriceAmount: optionalNumber(z.coerce.number().positive()),
  cleaningFeeAmount: z.coerce.number().min(0),
  securityDepositAmount: optionalNumber(z.coerce.number().min(0)),
  maxGuests: z.coerce.number().int().min(1),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  squareMeters: z.coerce.number().int().min(0),
  luxuryScore: z.coerce.number().int().min(0).max(100).default(70),
  hostId: z.string().min(1, "Choose a host."),
  checkInTime: z.string().min(1),
  checkOutTime: z.string().min(1),
  shortDescription: z.string().min(1, "Short description is required."),
  description: z.string().min(1, "Description is required."),
  cancellationPolicy: optionalEnum(["flexible", "moderate", "strict"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

function readBooleans(formData: FormData) {
  return {
    is_instant_book: formData.get("isInstantBook") === "on",
    is_featured: formData.get("isFeatured") === "on",
    is_pet_friendly: formData.get("isPetFriendly") === "on",
    has_pool: formData.get("hasPool") === "on",
    has_wifi: formData.get("hasWifi") === "on",
    has_parking: formData.get("hasParking") === "on",
    has_sea_view: formData.get("hasSeaView") === "on",
  };
}

function readListFields(formData: FormData) {
  const amenityIds = formData.getAll("amenityIds").map(String);
  const houseRules = String(formData.get("houseRules") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return { amenity_ids: amenityIds, house_rules: houseRules };
}

export async function createListing(
  _prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  await requireAdmin();

  const parsed = listingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
      values: formDataToValues(formData),
    };
  }
  const v = parsed.data;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("listings")
    .insert({
      slug: slugify(`${v.title}-${v.city}`),
      title: v.title,
      destination_id: v.destinationId,
      city: v.city,
      country: v.country,
      neighborhood: v.neighborhood || null,
      lat: v.lat,
      lng: v.lng,
      images: [],
      videos: [],
      price_amount: v.priceAmount,
      price_currency: "MAD",
      weekend_price_amount: v.weekendPriceAmount ?? null,
      weekend_price_currency: v.weekendPriceAmount ? "MAD" : null,
      cleaning_fee_amount: v.cleaningFeeAmount,
      cleaning_fee_currency: "MAD",
      security_deposit_amount: v.securityDepositAmount ?? null,
      security_deposit_currency: v.securityDepositAmount ? "MAD" : null,
      max_guests: v.maxGuests,
      bedrooms: v.bedrooms,
      bathrooms: v.bathrooms,
      square_meters: v.squareMeters,
      luxury_score: v.luxuryScore,
      host_id: v.hostId,
      check_in_time: v.checkInTime,
      check_out_time: v.checkOutTime,
      short_description: v.shortDescription,
      description: v.description,
      cancellation_policy: v.cancellationPolicy ?? null,
      seo_title: v.seoTitle || null,
      seo_description: v.seoDescription || null,
      status: v.status,
      rating: 0,
      review_count: 0,
      nearby_attractions: [],
      ...readBooleans(formData),
      ...readListFields(formData),
    })
    .select("id")
    .single();

  if (error) {
    const values = formDataToValues(formData);
    if (error.code === "23505") {
      return { error: "A listing with a very similar title/city already exists — try a more distinct title.", values };
    }
    return { error: "Something went wrong creating the property. Please try again.", values };
  }

  revalidatePath("/admin/properties");
  redirect(`/admin/properties/${data.id}/edit`);
}

export async function updateListing(
  _prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing listing." };

  const parsed = listingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
      values: formDataToValues(formData),
    };
  }
  const v = parsed.data;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("listings")
    .update({
      title: v.title,
      destination_id: v.destinationId,
      city: v.city,
      country: v.country,
      neighborhood: v.neighborhood || null,
      lat: v.lat,
      lng: v.lng,
      price_amount: v.priceAmount,
      weekend_price_amount: v.weekendPriceAmount ?? null,
      weekend_price_currency: v.weekendPriceAmount ? "MAD" : null,
      cleaning_fee_amount: v.cleaningFeeAmount,
      security_deposit_amount: v.securityDepositAmount ?? null,
      security_deposit_currency: v.securityDepositAmount ? "MAD" : null,
      max_guests: v.maxGuests,
      bedrooms: v.bedrooms,
      bathrooms: v.bathrooms,
      square_meters: v.squareMeters,
      luxury_score: v.luxuryScore,
      host_id: v.hostId,
      check_in_time: v.checkInTime,
      check_out_time: v.checkOutTime,
      short_description: v.shortDescription,
      description: v.description,
      cancellation_policy: v.cancellationPolicy ?? null,
      seo_title: v.seoTitle || null,
      seo_description: v.seoDescription || null,
      status: v.status,
      ...readBooleans(formData),
      ...readListFields(formData),
    })
    .eq("id", id);

  if (error) {
    return {
      error: "Something went wrong saving the property. Please try again.",
      values: formDataToValues(formData),
    };
  }

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}/edit`);
  redirect(`/admin/properties/${id}/edit?saved=1`);
}

export async function archiveListing(formData: FormData): Promise<ListingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const supabase = createAdminClient();
  const { error } = await supabase.from("listings").update({ status: "archived" }).eq("id", id);
  if (error) return { error: "Could not archive this property." };
  revalidatePath("/admin/properties");
  return { ok: true };
}

export async function togglePublish(formData: FormData): Promise<ListingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const nextStatus = formData.get("nextStatus") as "draft" | "published";
  const supabase = createAdminClient();
  const { error } = await supabase.from("listings").update({ status: nextStatus }).eq("id", id);
  if (error) return { error: "Could not update the publish state." };
  revalidatePath("/admin/properties");
  return { ok: true };
}

export async function toggleFeatured(formData: FormData): Promise<ListingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const supabase = createAdminClient();
  const { error } = await supabase.from("listings").update({ is_featured: isFeatured }).eq("id", id);
  if (error) return { error: "Could not update the featured state." };
  revalidatePath("/admin/properties");
  return { ok: true };
}

export async function duplicateListing(formData: FormData): Promise<ListingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const source = await getListingByIdAdmin(id);
  if (!source) return { error: "Property not found." };

  const supabase = createAdminClient();
  const slug = `${slugify(source.title)}-copy-${Date.now().toString(36)}`;
  const { error } = await supabase.from("listings").insert({
    slug,
    title: `${source.title} (Copy)`,
    destination_id: source.destinationId,
    city: source.city,
    country: source.country,
    neighborhood: source.neighborhood ?? null,
    lat: source.location.lat,
    lng: source.location.lng,
    images: source.images,
    videos: source.videos,
    price_amount: source.pricePerNight.amount,
    price_currency: source.pricePerNight.currency,
    weekend_price_amount: source.weekendPricePerNight?.amount ?? null,
    weekend_price_currency: source.weekendPricePerNight?.currency ?? null,
    cleaning_fee_amount: source.cleaningFee.amount,
    cleaning_fee_currency: source.cleaningFee.currency,
    security_deposit_amount: source.securityDeposit?.amount ?? null,
    security_deposit_currency: source.securityDeposit?.currency ?? null,
    max_guests: source.maxGuests,
    bedrooms: source.bedrooms,
    bathrooms: source.bathrooms,
    square_meters: source.squareMeters,
    amenity_ids: source.amenityIds,
    luxury_score: source.luxuryScore,
    is_instant_book: source.isInstantBook,
    is_featured: false,
    is_pet_friendly: source.isPetFriendly,
    has_pool: source.hasPool,
    has_wifi: source.hasWifi,
    has_parking: source.hasParking,
    has_sea_view: source.hasSeaView,
    short_description: source.shortDescription,
    description: source.description,
    house_rules: source.houseRules,
    check_in_time: source.checkInTime,
    check_out_time: source.checkOutTime,
    host_id: source.hostId,
    rating: 0,
    review_count: 0,
    nearby_attractions: source.nearbyAttractions,
    cancellation_policy: source.cancellationPolicy ?? null,
    seo_title: null,
    seo_description: null,
    status: "draft",
  });

  if (error) return { error: "Could not duplicate this property." };
  revalidatePath("/admin/properties");
  return { ok: true };
}

export async function deleteListing(formData: FormData): Promise<ListingActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  const supabase = createAdminClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return { error: "This property has bookings on record — archive it instead of deleting." };
    }
    return { error: "Could not delete this property." };
  }
  revalidatePath("/admin/properties");
  return { ok: true };
}

/** Appends newly uploaded Storage URLs to a listing's image or video gallery. */
export async function attachMedia(
  listingId: string,
  urls: string[],
  kind: "image" | "video"
): Promise<ListingActionResult> {
  await requireAdmin();
  const supabase = createAdminClient();
  const column = kind === "image" ? "images" : "videos";

  const { data: current } = await supabase.from("listings").select(column).eq("id", listingId).single();
  const existing = ((current as Record<string, string[]> | null)?.[column] ?? []) as string[];

  const { error } = await supabase
    .from("listings")
    .update({ [column]: [...existing, ...urls] })
    .eq("id", listingId);

  if (error) return { error: "Could not save the uploaded media." };
  revalidatePath(`/admin/properties/${listingId}/edit`);
  return { ok: true };
}

/** Persists a reordered (or trimmed, after a delete) gallery. */
export async function reorderMedia(
  listingId: string,
  urls: string[],
  kind: "image" | "video"
): Promise<ListingActionResult> {
  await requireAdmin();
  const supabase = createAdminClient();
  const column = kind === "image" ? "images" : "videos";

  const { error } = await supabase
    .from("listings")
    .update({ [column]: urls })
    .eq("id", listingId);

  if (error) return { error: "Could not save the gallery order." };
  revalidatePath(`/admin/properties/${listingId}/edit`);
  return { ok: true };
}
