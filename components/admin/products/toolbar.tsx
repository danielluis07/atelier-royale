"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PRODUCT_SORT_BY_OPTIONS, PRODUCT_STATUS_OPTIONS } from "@/constants";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Skeleton } from "@/components/ui/skeleton";

const ToolbarSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex h-9 w-40 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="size-4" />
      </div>
      <div className="flex h-9 w-45 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="size-4" />
      </div>
      <div className="flex h-9 w-40 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="size-4" />
      </div>
      <div className="flex h-9 w-40 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="size-4" />
      </div>
    </div>
  );
};

export const ProductsToolbar = ({
  categories,
}: {
  categories: { id: string; name: string }[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useHasMounted();

  const isAvailable = searchParams.get("isAvailable") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const getSortOrderOptions = (currentSortBy: string) => {
    if (currentSortBy === "price") {
      return [
        { label: "Maior preço", value: "desc" },
        { label: "Menor preço", value: "asc" },
      ];
    }
    if (currentSortBy === "name") {
      return [
        { label: "Z - A", value: "desc" },
        { label: "A - Z", value: "asc" },
      ];
    }
    // Default for createdAt / updatedAt
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

      // Reset to first page when changing filters/sorting
      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const hasActiveFilters =
    isAvailable !== undefined ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc" ||
    categoryId !== undefined;

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("isAvailable");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("categoryId");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  if (!hasMounted) {
    return <ToolbarSkeleton />;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-5">
      <Select
        value={categoryId ?? "all"}
        onValueChange={(value) =>
          updateParam("categoryId", value === "all" ? undefined : value)
        }>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Categoria</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={isAvailable ?? "all"}
        onValueChange={(value) =>
          updateParam("isAvailable", value === "all" ? undefined : value)
        }>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortBy}
        onValueChange={(value) => updateParam("sortBy", value)}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_SORT_BY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortOrder}
        onValueChange={(value) => updateParam("sortOrder", value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Ordem" />
        </SelectTrigger>
        <SelectContent>
          {dynamicSortOrderOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 px-2">
          <X className="mr-1 size-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};
