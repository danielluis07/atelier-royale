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
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Skeleton } from "@/components/ui/skeleton";

const REVIEW_STATUS_OPTIONS = [
  { label: "Status", value: "all" },
  { label: "Aprovadas", value: "true" },
  { label: "Reprovadas", value: "false" },
] as const;

const REVIEW_RATING_OPTIONS = [
  { label: "Todas as notas", value: "all" },
  { label: "5 estrelas", value: "5" },
  { label: "4 estrelas", value: "4" },
  { label: "3 estrelas", value: "3" },
  { label: "2 estrelas", value: "2" },
  { label: "1 estrela", value: "1" },
] as const;

const REVIEW_SORT_BY_OPTIONS = [
  { label: "Data de criação", value: "createdAt" },
] as const;

const ToolbarSkeleton = () => {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <div className="flex h-9 w-40 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="size-4" />
      </div>
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
    </div>
  );
};

export const ReviewsToolbar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useHasMounted();

  const isApproved = searchParams.get("isApproved") ?? undefined;
  const rating = searchParams.get("rating") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const getSortOrderOptions = () => {
    return [
      { label: "Mais recentes", value: "desc" },
      { label: "Mais antigas", value: "asc" },
    ];
  };

  const dynamicSortOrderOptions = getSortOrderOptions();

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

  const hasActiveFilters =
    isApproved !== undefined ||
    rating !== undefined ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("isApproved");
    params.delete("rating");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  if (!hasMounted) {
    return <ToolbarSkeleton />;
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <Select
        value={isApproved ?? "all"}
        onValueChange={(value) =>
          updateParam("isApproved", value === "all" ? undefined : value)
        }>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {REVIEW_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rating ?? "all"}
        onValueChange={(value) =>
          updateParam("rating", value === "all" ? undefined : value)
        }>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Estrelas" />
        </SelectTrigger>
        <SelectContent>
          {REVIEW_RATING_OPTIONS.map((option) => (
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
          {REVIEW_SORT_BY_OPTIONS.map((option) => (
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
