import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllListingsAdmin } from "@/lib/data/admin/listings";
import { PropertiesTable } from "@/components/admin/properties-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Properties — LUMA Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const listings = await getAllListingsAdmin();
  const published = listings.filter((l) => l.status === "published").length;
  const draft = listings.filter((l) => l.status === "draft").length;
  const archived = listings.filter((l) => l.status === "archived").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Portfolio</p>
          <h1 className="mt-1 font-heading text-2xl font-medium text-foreground md:text-3xl">Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {listings.length} total &middot; {published} published &middot; {draft} draft &middot; {archived} archived
          </p>
        </div>
        <Button render={<Link href="/admin/properties/new" />} nativeButton={false} size="lg">
          <Plus />
          New property
        </Button>
      </div>
      <PropertiesTable listings={listings} />
    </div>
  );
}
