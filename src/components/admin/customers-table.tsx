"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import type { AdminCustomerSummary } from "@/lib/data/admin/customers";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const columns: ColumnDef<AdminCustomerSummary>[] = [
  {
    accessorKey: "name",
    header: "Guest",
    cell: ({ row }) => (
      <Link href={`/admin/customers/${row.original.id}`} className="block">
        <p className="text-sm font-medium text-foreground">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </Link>
    ),
  },
  {
    accessorKey: "stayCount",
    header: "Stays",
  },
  {
    accessorKey: "totalSpent",
    header: "Total spent",
    cell: ({ row }) => `${row.original.totalSpent.amount.toLocaleString()} ${row.original.totalSpent.currency}`,
  },
  {
    accessorKey: "lastBookingAt",
    header: "Last booking",
    cell: ({ row }) => formatDate(row.original.lastBookingAt),
  },
];

export function CustomersTable({ customers }: { customers: AdminCustomerSummary[] }) {
  return <DataTable columns={columns} data={customers} emptyMessage="No guests yet." />;
}
