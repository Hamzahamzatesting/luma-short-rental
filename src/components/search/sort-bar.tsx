"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/lib/data/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
  { value: "luxury", label: "Luxury Score" },
];

export function SortBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("sort") as SortOption) ?? "newest";

  function handleChange(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "newest") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="h-9 text-sm">
        <span className="text-muted-foreground">Sort:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
