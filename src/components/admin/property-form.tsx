"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUploader } from "@/components/admin/media-uploader";
import { AddHostDialog } from "@/components/admin/add-host-dialog";
import { AvailabilityBlocksManager } from "@/components/admin/availability-blocks-manager";
import type { ListingFormState } from "@/lib/actions/admin/listings";
import type { AvailabilityBlock } from "@/lib/data/admin/availability";
import type { Amenity, Destination, Host, Listing } from "@/lib/data/types";

interface PropertyFormProps {
  listing?: Listing;
  destinations: Destination[];
  hosts: Host[];
  amenities: Amenity[];
  availabilityBlocks?: AvailabilityBlock[];
  action: (prevState: ListingFormState, formData: FormData) => Promise<ListingFormState>;
}

// base-ui's <Select.Value> renders the raw stored value unless given a
// render function — it can't infer a SelectItem's label from an
// uncontrolled `defaultValue` on first paint, so these back that lookup.
const STATUS_LABELS = { draft: "Draft", published: "Published", archived: "Archived" };
const CANCELLATION_LABELS = { flexible: "Flexible", moderate: "Moderate", strict: "Strict" };

// React resets a `<form action>`'s uncontrolled fields on every submission,
// even ones that come back with a validation error — the action echoes
// back what was submitted (`state.values`) and these helpers read it back
// out, taking priority over the listing's saved values.
function pick(state: ListingFormState, name: string): string | undefined {
  const v = state?.values?.[name];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}
function pickArray(state: ListingFormState, name: string): string[] | undefined {
  const v = state?.values?.[name];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v : [v];
}
function pickBool(state: ListingFormState, name: string, fallback: boolean): boolean {
  if (!state?.values) return fallback;
  return pick(state, name) === "on";
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function BoolField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
      <Label htmlFor={name} className="font-normal">
        {label}
      </Label>
      <Switch id={name} name={name} defaultChecked={defaultChecked} />
    </div>
  );
}

export function PropertyForm({ listing, destinations, hosts, amenities, availabilityBlocks, action }: PropertyFormProps) {
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(action, undefined);
  // Forces the (uncontrolled) fields below to remount and re-read their
  // defaultValue/defaultChecked from the latest `state` after React's
  // automatic post-submit form reset — see the `pick*` helpers above.
  const formKey = state ? JSON.stringify(state.values ?? {}) : "initial";

  // The host select is controlled (not remount-keyed like the rest of the
  // form) so a host added mid-session via AddHostDialog survives a failed
  // submission instead of vanishing when the Tabs subtree remounts.
  const [hostOptions, setHostOptions] = useState<Pick<Host, "id" | "name">[]>(hosts);
  const [selectedHostId, setSelectedHostId] = useState(pick(state, "hostId") ?? listing?.hostId ?? "");
  // Recover the selected host after a failed submission — adjusted during
  // render (not an effect) so it lands before the browser paints the stale
  // value; see the `pick*` helpers above for why this recovery is needed.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    const recovered = pick(state, "hostId");
    if (recovered) setSelectedHostId(recovered);
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}

      <Tabs defaultValue="basics" key={formKey}>
        <TabsList>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="location">Location &amp; Capacity</TabsTrigger>
          <TabsTrigger value="pricing">Pricing &amp; Policies</TabsTrigger>
          <TabsTrigger value="amenities">Amenities &amp; Rules</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          {listing ? <TabsTrigger value="media">Media</TabsTrigger> : null}
          {listing ? <TabsTrigger value="availability">Availability</TabsTrigger> : null}
        </TabsList>

        <TabsContent value="basics" keepMounted className="flex flex-col gap-4 pt-4">
          <Field label="Title" htmlFor="title">
            <Input id="title" name="title" defaultValue={pick(state, "title") ?? listing?.title} required minLength={3} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Destination" htmlFor="destinationId">
              <Select name="destinationId" defaultValue={pick(state, "destinationId") ?? listing?.destinationId}>
                <SelectTrigger id="destinationId" className="w-full">
                  <SelectValue placeholder="Choose a destination">
                    {(value: string | null) => destinations.find((d) => d.id === value)?.name ?? "Choose a destination"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Host" htmlFor="hostId">
              <div className="flex gap-2">
                <Select name="hostId" value={selectedHostId} onValueChange={(v) => setSelectedHostId(v as string)}>
                  <SelectTrigger id="hostId" className="w-full">
                    <SelectValue placeholder="Choose a host">
                      {(value: string | null) => hostOptions.find((h) => h.id === value)?.name ?? "Choose a host"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {hostOptions.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <AddHostDialog
                  onCreated={(host) => {
                    setHostOptions((prev) => [...prev, host]);
                    setSelectedHostId(host.id);
                  }}
                />
              </div>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" htmlFor="city">
              <Input id="city" name="city" defaultValue={pick(state, "city") ?? listing?.city} required />
            </Field>
            <Field label="Country" htmlFor="country">
              <Input id="country" name="country" defaultValue={pick(state, "country") ?? listing?.country ?? "Morocco"} required />
            </Field>
            <Field label="Neighborhood" htmlFor="neighborhood">
              <Input id="neighborhood" name="neighborhood" defaultValue={pick(state, "neighborhood") ?? listing?.neighborhood} />
            </Field>
          </div>
          <Field label="Short description" htmlFor="shortDescription">
            <Textarea
              id="shortDescription"
              name="shortDescription"
              defaultValue={pick(state, "shortDescription") ?? listing?.shortDescription}
              required
              rows={2}
            />
          </Field>
          <Field label="Full description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              defaultValue={pick(state, "description") ?? listing?.description}
              required
              rows={6}
            />
          </Field>
          <Field label="Status" htmlFor="status">
            <Select name="status" defaultValue={pick(state, "status") ?? listing?.status ?? "draft"}>
              <SelectTrigger id="status" className="w-full sm:w-56">
                <SelectValue>{(value: keyof typeof STATUS_LABELS | null) => (value ? STATUS_LABELS[value] : "")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{STATUS_LABELS.draft}</SelectItem>
                <SelectItem value="published">{STATUS_LABELS.published}</SelectItem>
                <SelectItem value="archived">{STATUS_LABELS.archived}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </TabsContent>

        <TabsContent value="location" keepMounted className="flex flex-col gap-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude" htmlFor="lat">
              <Input
                id="lat"
                name="lat"
                type="number"
                step="any"
                defaultValue={pick(state, "lat") ?? listing?.location.lat}
                required
              />
            </Field>
            <Field label="Longitude" htmlFor="lng">
              <Input
                id="lng"
                name="lng"
                type="number"
                step="any"
                defaultValue={pick(state, "lng") ?? listing?.location.lng}
                required
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Max guests" htmlFor="maxGuests">
              <Input
                id="maxGuests"
                name="maxGuests"
                type="number"
                min={1}
                defaultValue={pick(state, "maxGuests") ?? listing?.maxGuests ?? 2}
                required
              />
            </Field>
            <Field label="Bedrooms" htmlFor="bedrooms">
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min={0}
                defaultValue={pick(state, "bedrooms") ?? listing?.bedrooms ?? 1}
                required
              />
            </Field>
            <Field label="Bathrooms" htmlFor="bathrooms">
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min={0}
                defaultValue={pick(state, "bathrooms") ?? listing?.bathrooms ?? 1}
                required
              />
            </Field>
            <Field label="Square meters" htmlFor="squareMeters">
              <Input
                id="squareMeters"
                name="squareMeters"
                type="number"
                min={0}
                defaultValue={pick(state, "squareMeters") ?? listing?.squareMeters ?? 50}
                required
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Check-in time" htmlFor="checkInTime">
              <Input
                id="checkInTime"
                name="checkInTime"
                defaultValue={pick(state, "checkInTime") ?? listing?.checkInTime ?? "3:00 PM"}
                required
              />
            </Field>
            <Field label="Check-out time" htmlFor="checkOutTime">
              <Input
                id="checkOutTime"
                name="checkOutTime"
                defaultValue={pick(state, "checkOutTime") ?? listing?.checkOutTime ?? "11:00 AM"}
                required
              />
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="pricing" keepMounted className="flex flex-col gap-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Nightly price (MAD)" htmlFor="priceAmount">
              <Input
                id="priceAmount"
                name="priceAmount"
                type="number"
                min={0}
                defaultValue={pick(state, "priceAmount") ?? listing?.pricePerNight.amount}
                required
              />
            </Field>
            <Field label="Weekend price (MAD)" htmlFor="weekendPriceAmount">
              <Input
                id="weekendPriceAmount"
                name="weekendPriceAmount"
                type="number"
                min={0}
                defaultValue={pick(state, "weekendPriceAmount") ?? listing?.weekendPricePerNight?.amount}
              />
            </Field>
            <Field label="Cleaning fee (MAD)" htmlFor="cleaningFeeAmount">
              <Input
                id="cleaningFeeAmount"
                name="cleaningFeeAmount"
                type="number"
                min={0}
                defaultValue={pick(state, "cleaningFeeAmount") ?? listing?.cleaningFee.amount}
                required
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Security deposit (MAD)" htmlFor="securityDepositAmount">
              <Input
                id="securityDepositAmount"
                name="securityDepositAmount"
                type="number"
                min={0}
                defaultValue={pick(state, "securityDepositAmount") ?? listing?.securityDeposit?.amount}
              />
            </Field>
            <Field label="Cancellation policy" htmlFor="cancellationPolicy">
              <Select
                name="cancellationPolicy"
                defaultValue={pick(state, "cancellationPolicy") ?? listing?.cancellationPolicy}
              >
                <SelectTrigger id="cancellationPolicy" className="w-full">
                  <SelectValue placeholder="Choose a policy">
                    {(value: keyof typeof CANCELLATION_LABELS | null) => (value ? CANCELLATION_LABELS[value] : "Choose a policy")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">{CANCELLATION_LABELS.flexible}</SelectItem>
                  <SelectItem value="moderate">{CANCELLATION_LABELS.moderate}</SelectItem>
                  <SelectItem value="strict">{CANCELLATION_LABELS.strict}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Luxury score (0-100)" htmlFor="luxuryScore">
              <Input
                id="luxuryScore"
                name="luxuryScore"
                type="number"
                min={0}
                max={100}
                defaultValue={pick(state, "luxuryScore") ?? listing?.luxuryScore ?? 70}
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <BoolField name="isInstantBook" label="Instant book" defaultChecked={pickBool(state, "isInstantBook", listing?.isInstantBook ?? false)} />
            <BoolField
              name="isFeatured"
              label="Featured on homepage"
              defaultChecked={pickBool(state, "isFeatured", listing?.isFeatured ?? false)}
            />
          </div>
        </TabsContent>

        <TabsContent value="amenities" keepMounted className="flex flex-col gap-5 pt-4">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Amenities</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {amenities.map((a) => (
                <label key={a.id} className="flex items-center gap-2 text-sm text-foreground">
                  <Checkbox
                    name="amenityIds"
                    value={a.id}
                    defaultChecked={(pickArray(state, "amenityIds") ?? listing?.amenityIds ?? []).includes(a.id)}
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <BoolField name="isPetFriendly" label="Pet friendly" defaultChecked={pickBool(state, "isPetFriendly", listing?.isPetFriendly ?? false)} />
            <BoolField name="hasPool" label="Pool" defaultChecked={pickBool(state, "hasPool", listing?.hasPool ?? false)} />
            <BoolField name="hasWifi" label="WiFi" defaultChecked={pickBool(state, "hasWifi", listing?.hasWifi ?? true)} />
            <BoolField name="hasParking" label="Parking" defaultChecked={pickBool(state, "hasParking", listing?.hasParking ?? false)} />
            <BoolField name="hasSeaView" label="Sea view" defaultChecked={pickBool(state, "hasSeaView", listing?.hasSeaView ?? false)} />
          </div>
          <Field label="House rules (one per line)" htmlFor="houseRules">
            <Textarea
              id="houseRules"
              name="houseRules"
              rows={5}
              defaultValue={pick(state, "houseRules") ?? listing?.houseRules.join("\n")}
              placeholder="No smoking indoors&#10;Quiet hours from 10pm to 8am"
            />
          </Field>
        </TabsContent>

        <TabsContent value="seo" keepMounted className="flex flex-col gap-4 pt-4">
          <Field label="SEO title" htmlFor="seoTitle">
            <Input id="seoTitle" name="seoTitle" defaultValue={pick(state, "seoTitle") ?? listing?.seoTitle} />
          </Field>
          <Field label="SEO description" htmlFor="seoDescription">
            <Textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              defaultValue={pick(state, "seoDescription") ?? listing?.seoDescription}
            />
          </Field>
        </TabsContent>

        {listing ? (
          <TabsContent value="media" keepMounted className="flex flex-col gap-6 pt-4">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Photos</p>
              <MediaUploader listingId={listing.id} kind="image" urls={listing.images} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Videos</p>
              <MediaUploader listingId={listing.id} kind="video" urls={listing.videos} />
            </div>
          </TabsContent>
        ) : null}

        {listing ? (
          <TabsContent value="availability" keepMounted className="pt-4">
            <AvailabilityBlocksManager listingId={listing.id} blocks={availabilityBlocks ?? []} />
          </TabsContent>
        ) : null}
      </Tabs>

      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : listing ? "Save changes" : "Create property"}
        </Button>
      </div>
    </form>
  );
}
