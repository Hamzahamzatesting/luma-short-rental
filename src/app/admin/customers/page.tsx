import type { Metadata } from "next";
import { getAllCustomersAdmin } from "@/lib/data/admin/customers";
import { CustomersTable } from "@/components/admin/customers-table";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = { title: "Customers — LUMA Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const customers = await getAllCustomersAdmin(q);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label-eyebrow">Operations</p>
        <h1 className="mt-1 font-heading text-2xl font-medium text-foreground md:text-3xl">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">{customers.length} guests</p>
      </div>

      <form method="GET" className="max-w-sm">
        <Input name="q" defaultValue={q} placeholder="Search by name or email…" />
      </form>

      <CustomersTable customers={customers} />
    </div>
  );
}
