import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListingByIdAdmin } from "@/lib/data/admin/listings";
import { getDestinations } from "@/lib/data/destinations";
import { getHosts } from "@/lib/data/hosts";
import { getAmenities } from "@/lib/data/amenities";
import { updateListing } from "@/lib/actions/admin/listings";
import { PropertyForm } from "@/components/admin/property-form";

export const metadata: Metadata = { title: "Edit property — LUMA Admin" };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, destinations, hosts, amenities] = await Promise.all([
    getListingByIdAdmin(id),
    getDestinations(),
    getHosts(),
    getAmenities(),
  ]);

  if (!listing) notFound();

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium text-foreground">{listing.title}</h1>
        <p className="text-sm text-muted-foreground">{listing.city}</p>
      </div>
      <PropertyForm
        listing={listing}
        destinations={destinations}
        hosts={hosts}
        amenities={amenities}
        action={updateListing}
      />
    </div>
  );
}
