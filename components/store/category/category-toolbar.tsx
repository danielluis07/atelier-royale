"use client";

import { useHasMounted } from "@/hooks/use-has-mounted";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { STORE_SORT_BY_OPTIONS } from "@/constants";

const ToolbarSkeleton = () => (
  <div className="flex flex-wrap items-center gap-3">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex h-10 w-44 items-center justify-between gap-2 border border-border bg-transparent px-4 py-2">
        <Skeleton className="h-3 flex-1 bg-muted" />
        <Skeleton className="size-3 bg-muted" />
      </div>
    ))}
  </div>
);

export const CategoryToolbar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useHasMounted();

  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const getSortOrderOptions = (currentSortBy: string) => {
    if (currentSortBy === "price") {
      return [
        { label: "Maior preço", value: "desc" },
        { label: "Menor preço", value: "asc" },
      ];
    }
    if (currentSortBy === "name") {
      return [
        { label: "Z — A", value: "desc" },
        { label: "A — Z", value: "asc" },
      ];
    }
    return [
      { label: "Mais recentes", value: "desc" },
      { label: "Mais antigos", value: "asc" },
    ];
  };

  const dynamicSortOrderOptions = getSortOrderOptions(sortBy);

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const hasActiveFilters = sortBy !== "createdAt" || sortOrder !== "desc";

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sortBy");
    params.delete("sortOrder");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  if (!hasMounted) {
    return <ToolbarSkeleton />;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 mr-2 text-muted-foreground">
        <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
        <span className="text-xs tracking-[0.15em] uppercase font-sans hidden sm:inline">
          Filtros
        </span>
      </div>

      {/* Sort By */}
      <Select
        value={sortBy}
        onValueChange={(value) => updateParam("sortBy", value)}>
        <SelectTrigger className="w-44 h-10 rounded-none border-border text-xs tracking-widest uppercase font-sans bg-transparent hover:border-primary transition-colors duration-300">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          {STORE_SORT_BY_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-xs tracking-wide font-sans">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Order */}
      <Select
        value={sortOrder}
        onValueChange={(value) => updateParam("sortOrder", value)}>
        <SelectTrigger className="w-44 h-10 rounded-none border-border text-xs tracking-widest uppercase font-sans bg-transparent hover:border-primary transition-colors duration-300">
          <SelectValue placeholder="Ordem" />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          {dynamicSortOrderOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-xs tracking-wide font-sans">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors duration-300 ml-2 border-b border-transparent hover:border-foreground pb-0.5">
          <X className="w-3 h-3" strokeWidth={1.5} />
          Limpar
        </button>
      )}
    </div>
  );
};
