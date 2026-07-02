"use client";

import Image from "next/image";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Star, Zap } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { ListingStatusBadge } from "@/components/admin/listing-status-badge";
import { ActionButton } from "@/components/admin/action-button";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  archiveListing,
  deleteListing,
  duplicateListing,
  toggleFeatured,
  togglePublish,
} from "@/lib/actions/admin/listings";
import type { AdminListingSummary } from "@/lib/data/admin/listings";

const columns: ColumnDef<AdminListingSummary>[] = [
  {
    accessorKey: "title",
    header: "Property",
    cell: ({ row }) => {
      const listing = row.original;
      return (
        <Link href={`/admin/properties/${listing.id}/edit`} className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
            {listing.image ? (
              <Image src={listing.image} alt="" fill className="object-cover" sizes="40px" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{listing.title}</p>
            <p className="truncate text-xs text-muted-foreground">{listing.destinationName}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ListingStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "pricePerNight",
    header: "Price / night",
    cell: ({ row }) => `${row.original.pricePerNight.amount.toLocaleString()} ${row.original.pricePerNight.currency}`,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (row.original.reviewCount > 0 ? `${row.original.rating.toFixed(1)} (${row.original.reviewCount})` : "—"),
  },
  {
    id: "flags",
    header: "Flags",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {row.original.isFeatured ? <Star className="size-3.5 fill-gold text-gold" /> : null}
        {row.original.isInstantBook ? <Zap className="size-3.5" /> : null}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const listing = row.original;
      const isPublished = listing.status === "published";
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href={`/admin/properties/${listing.id}/edit`}>Edit</Link>} />
            <ActionButton
              action={togglePublish}
              formData={{ id: listing.id, nextStatus: isPublished ? "draft" : "published" }}
              successMessage={isPublished ? "Unpublished" : "Published"}
              variant="ghost"
              size="sm"
              className="w-full justify-start px-1.5 font-normal"
            >
              {isPublished ? "Unpublish" : "Publish"}
            </ActionButton>
            <ActionButton
              action={toggleFeatured}
              formData={{ id: listing.id, isFeatured: String(!listing.isFeatured) }}
              successMessage={listing.isFeatured ? "Removed from featured" : "Featured on homepage"}
              variant="ghost"
              size="sm"
              className="w-full justify-start px-1.5 font-normal"
            >
              {listing.isFeatured ? "Unfeature" : "Feature"}
            </ActionButton>
            <ActionButton
              action={duplicateListing}
              formData={{ id: listing.id }}
              successMessage="Duplicated as a draft"
              variant="ghost"
              size="sm"
              className="w-full justify-start px-1.5 font-normal"
            >
              Duplicate
            </ActionButton>
            <DropdownMenuSeparator />
            <ActionButton
              action={archiveListing}
              formData={{ id: listing.id }}
              successMessage="Archived"
              variant="ghost"
              size="sm"
              className="w-full justify-start px-1.5 font-normal text-destructive hover:text-destructive"
            >
              Archive
            </ActionButton>
            <ConfirmActionButton
              action={deleteListing}
              formData={{ id: listing.id }}
              title="Delete this property?"
              description="This can't be undone. Properties with existing bookings can't be deleted — archive them instead."
              confirmLabel="Delete"
              successMessage="Deleted"
              trigger={
                <Button variant="ghost" size="sm" className="w-full justify-start px-1.5 font-normal text-destructive hover:text-destructive">
                  Delete
                </Button>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PropertiesTable({ listings }: { listings: AdminListingSummary[] }) {
  return <DataTable columns={columns} data={listings} emptyMessage="No properties yet." />;
}
