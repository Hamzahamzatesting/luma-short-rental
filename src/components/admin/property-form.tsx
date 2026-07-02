"use client";

import { useActionState, type ReactNode } from "react";
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
import type { ListingFormState } from "@/lib/actions/admin/listings";
import type { Amenity, Destination, Host, Listing } from "@/lib/data/types";

interface PropertyFormProps {
  listing?: Listing;
  destinations: Destination[];
  hosts: Host[];
  amenities: Amenity[];
  action: (prevState: ListingFormState, formData: FormData) => Promise<ListingFormState>;
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

export function PropertyForm({ listing, destinations, hosts, amenities, action }: PropertyFormProps) {
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}

      <Tabs defaultValue="basics">
        <TabsList>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="location">Location &amp; Capacity</TabsTrigger>
          <TabsTrigger value="pricing">Pricing &amp; Policies</TabsTrigger>
          <TabsTrigger value="amenities">Amenities &amp; Rules</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          {listing ? <TabsTrigger value="media">Media</TabsTrigger> : null}
        </TabsList>

        <TabsContent value="basics" keepMounted className="flex flex-col gap-4 pt-4">
          <Field label="Title" htmlFor="title">
            <Input id="title" name="title" defaultValue={listing?.title} required minLength={3} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Destination" htmlFor="destinationId">
              <Select name="destinationId" defaultValue={listing?.destinationId}>
                <SelectTrigger id="destinationId" className="w-full">
                  <SelectValue placeholder="Choose a destination" />
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
              <Select name="hostId" defaultValue={listing?.hostId}>
                <SelectTrigger id="hostId" className="w-full">
                  <SelectValue placeholder="Choose a host" />
                </SelectTrigger>
                <SelectContent>
                  {hosts.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" htmlFor="city">
              <Input id="city" name="city" defaultValue={listing?.city} required />
            </Field>
            <Field label="Country" htmlFor="country">
              <Input id="country" name="country" defaultValue={listing?.country ?? "Morocco"} required />
            </Field>
            <Field label="Neighborhood" htmlFor="neighborhood">
              <Input id="neighborhood" name="neighborhood" defaultValue={listing?.neighborhood} />
            </Field>
          </div>
          <Field label="Short description" htmlFor="shortDescription">
            <Textarea
              id="shortDescription"
              name="shortDescription"
              defaultValue={listing?.shortDescription}
              required
              rows={2}
            />
          </Field>
          <Field label="Full description" htmlFor="description">
            <Textarea id="description" name="description" defaultValue={listing?.description} required rows={6} />
          </Field>
          <Field label="Status" htmlFor="status">
            <Select name="status" defaultValue={listing?.status ?? "draft"}>
              <SelectTrigger id="status" className="w-full sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </TabsContent>

        <TabsContent value="location" keepMounted className="flex flex-col gap-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude" htmlFor="lat">
              <Input id="lat" name="lat" type="number" step="any" defaultValue={listing?.location.lat} required />
            </Field>
            <Field label="Longitude" htmlFor="lng">
              <Input id="lng" name="lng" type="number" step="any" defaultValue={listing?.location.lng} required />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Max guests" htmlFor="maxGuests">
              <Input id="maxGuests" name="maxGuests" type="number" min={1} defaultValue={listing?.maxGuests ?? 2} required />
            </Field>
            <Field label="Bedrooms" htmlFor="bedrooms">
              <Input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={listing?.bedrooms ?? 1} required />
            </Field>
            <Field label="Bathrooms" htmlFor="bathrooms">
              <Input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={listing?.bathrooms ?? 1} required />
            </Field>
            <Field label="Square meters" htmlFor="squareMeters">
              <Input id="squareMeters" name="squareMeters" type="number" min={0} defaultValue={listing?.squareMeters ?? 50} required />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Check-in time" htmlFor="checkInTime">
              <Input id="checkInTime" name="checkInTime" defaultValue={listing?.checkInTime ?? "3:00 PM"} required />
            </Field>
            <Field label="Check-out time" htmlFor="checkOutTime">
              <Input id="checkOutTime" name="checkOutTime" defaultValue={listing?.checkOutTime ?? "11:00 AM"} required />
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="pricing" keepMounted className="flex flex-col gap-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Nightly price (MAD)" htmlFor="priceAmount">
              <Input id="priceAmount" name="priceAmount" type="number" min={0} defaultValue={listing?.pricePerNight.amount} required />
            </Field>
            <Field label="Weekend price (MAD)" htmlFor="weekendPriceAmount">
              <Input
                id="weekendPriceAmount"
                name="weekendPriceAmount"
                type="number"
                min={0}
                defaultValue={listing?.weekendPricePerNight?.amount}
              />
            </Field>
            <Field label="Cleaning fee (MAD)" htmlFor="cleaningFeeAmount">
              <Input
                id="cleaningFeeAmount"
                name="cleaningFeeAmount"
                type="number"
                min={0}
                defaultValue={listing?.cleaningFee.amount}
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
                defaultValue={listing?.securityDeposit?.amount}
              />
            </Field>
            <Field label="Cancellation policy" htmlFor="cancellationPolicy">
              <Select name="cancellationPolicy" defaultValue={listing?.cancellationPolicy}>
                <SelectTrigger id="cancellationPolicy" className="w-full">
                  <SelectValue placeholder="Choose a policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
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
                defaultValue={listing?.luxuryScore ?? 70}
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <BoolField name="isInstantBook" label="Instant book" defaultChecked={listing?.isInstantBook ?? false} />
            <BoolField name="isFeatured" label="Featured on homepage" defaultChecked={listing?.isFeatured ?? false} />
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
                    defaultChecked={listing?.amenityIds.includes(a.id)}
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <BoolField name="isPetFriendly" label="Pet friendly" defaultChecked={listing?.isPetFriendly ?? false} />
            <BoolField name="hasPool" label="Pool" defaultChecked={listing?.hasPool ?? false} />
            <BoolField name="hasWifi" label="WiFi" defaultChecked={listing?.hasWifi ?? true} />
            <BoolField name="hasParking" label="Parking" defaultChecked={listing?.hasParking ?? false} />
            <BoolField name="hasSeaView" label="Sea view" defaultChecked={listing?.hasSeaView ?? false} />
          </div>
          <Field label="House rules (one per line)" htmlFor="houseRules">
            <Textarea
              id="houseRules"
              name="houseRules"
              rows={5}
              defaultValue={listing?.houseRules.join("\n")}
              placeholder="No smoking indoors&#10;Quiet hours from 10pm to 8am"
            />
          </Field>
        </TabsContent>

        <TabsContent value="seo" keepMounted className="flex flex-col gap-4 pt-4">
          <Field label="SEO title" htmlFor="seoTitle">
            <Input id="seoTitle" name="seoTitle" defaultValue={listing?.seoTitle} />
          </Field>
          <Field label="SEO description" htmlFor="seoDescription">
            <Textarea id="seoDescription" name="seoDescription" rows={3} defaultValue={listing?.seoDescription} />
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
