import type { Metadata } from "next";
import Link from "next/link";
import { getAllReviewsAdmin } from "@/lib/data/admin/reviews";
import { ReviewsTable } from "@/components/admin/reviews-table";
import { cn } from "@/lib/utils";
import type { ReviewStatus } from "@/lib/data/types";

export const metadata: Metadata = { title: "Reviews — LUMA Admin" };
export const dynamic = "force-dynamic";

const FILTERS: { label: string; status?: ReviewStatus }[] = [
  { label: "All" },
  { label: "Pending", status: "pending" },
  { label: "Approved", status: "approved" },
  { label: "Hidden", status: "hidden" },
];

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const reviews = await getAllReviewsAdmin(status as ReviewStatus | undefined);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label-eyebrow">Operations</p>
        <h1 className="mt-1 font-heading text-2xl font-medium text-foreground md:text-3xl">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">{reviews.length} reviews</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={f.status ? `/admin/reviews?status=${f.status}` : "/admin/reviews"}
            className={cn(
              "tracking-label rounded-full border px-3 py-1 text-xs font-medium uppercase transition-colors",
              status === f.status || (!status && !f.status)
                ? "border-gold bg-gold/10 text-gold"
                : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <ReviewsTable reviews={reviews} />
    </div>
  );
}
