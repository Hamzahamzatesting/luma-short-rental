import type { Metadata } from "next";
import { getDestinations } from "@/lib/data/destinations";
import { getHosts } from "@/lib/data/hosts";
import { getAmenities } from "@/lib/data/amenities";
import { createListing } from "@/lib/actions/admin/listings";
import { PropertyForm } from "@/components/admin/property-form";

export const metadata: Metadata = { title: "New property — LUMA Admin" };

export default async function NewPropertyPage() {
  const [destinations, hosts, amenities] = await Promise.all([
    getDestinations(),
    getHosts(),
    getAmenities(),
  ]);

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium text-foreground">New property</h1>
        <p className="text-sm text-muted-foreground">
          Photos and videos can be added once the property is created.
        </p>
      </div>
      <PropertyForm destinations={destinations} hosts={hosts} amenities={amenities} action={createListing} />
    </div>
  );
}
