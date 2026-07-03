"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { ActionButton } from "@/components/admin/action-button";
import { Badge } from "@/components/ui/badge";
import { setReviewStatus, toggleReviewFeatured } from "@/lib/actions/admin/reviews";
import { cn } from "@/lib/utils";
import type { AdminReview } from "@/lib/data/admin/reviews";

const STATUS_STYLE: Record<AdminReview["status"], string> = {
  pending: "bg-muted text-muted-foreground",
  approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  hidden: "bg-destructive/10 text-destructive",
};

const columns: ColumnDef<AdminReview>[] = [
  {
    accessorKey: "authorName",
    header: "Review",
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{review.authorName}</p>
            <span className="flex items-center gap-0.5 text-xs text-gold">
              <Star className="size-3 fill-gold" />
              {review.rating.toFixed(1)}
            </span>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{review.comment}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "listingTitle",
    header: "Property",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="ghost" className={cn("uppercase tracking-wide", STATUS_STYLE[row.original.status])}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          {review.status !== "approved" ? (
            <ActionButton
              action={setReviewStatus}
              formData={{ id: review.id, status: "approved" }}
              successMessage="Approved"
              variant="outline"
              size="sm"
            >
              Approve
            </ActionButton>
          ) : null}
          {review.status !== "hidden" ? (
            <ActionButton
              action={setReviewStatus}
              formData={{ id: review.id, status: "hidden" }}
              successMessage="Hidden"
              variant="outline"
              size="sm"
            >
              Hide
            </ActionButton>
          ) : null}
          <ActionButton
            action={toggleReviewFeatured}
            formData={{ id: review.id, isFeatured: String(!review.isFeatured) }}
            successMessage={review.isFeatured ? "Removed from featured" : "Featured"}
            variant={review.isFeatured ? "default" : "outline"}
            size="sm"
          >
            {review.isFeatured ? "Featured" : "Feature"}
          </ActionButton>
          {review.listingSlug ? (
            <Link
              href={`/listing/${review.listingSlug}`}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
              target="_blank"
            >
              View listing
            </Link>
          ) : null}
        </div>
      );
    },
  },
];

export function ReviewsTable({ reviews }: { reviews: AdminReview[] }) {
  return <DataTable columns={columns} data={reviews} emptyMessage="No reviews." />;
}
