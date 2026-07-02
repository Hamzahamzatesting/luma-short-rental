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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-medium text-foreground">Properties</h1>
          <p className="text-sm text-muted-foreground">{listings.length} total</p>
        </div>
        <Button render={<Link href="/admin/properties/new" />} nativeButton={false}>
          <Plus />
          New property
        </Button>
      </div>
      <PropertiesTable listings={listings} />
    </div>
  );
}
