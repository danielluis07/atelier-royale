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
import {
  DELIVERY_STATUS_OPTIONS,
  ORDER_SORT_BY_OPTIONS,
  ORDER_STATUS_OPTIONS,
} from "@/constants";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Skeleton } from "@/components/ui/skeleton";

const ToolbarSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-5">
      <div className="flex h-9 w-45 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2">
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

export const OrdersToolbar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useHasMounted();

  const status = searchParams.get("status") ?? undefined;
  const deliveryStatus = searchParams.get("deliveryStatus") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const getSortOrderOptions = (currentSortBy: string) => {
    if (currentSortBy === "totalAmount") {
      return [
        { label: "Maior valor", value: "desc" },
        { label: "Menor valor", value: "asc" },
      ];
    }

    if (currentSortBy === "orderNumber") {
      return [
        { label: "Mais recente", value: "desc" },
        { label: "Mais antigo", value: "asc" },
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

  const hasActiveFilters =
    status !== undefined ||
    deliveryStatus !== undefined ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    params.delete("deliveryStatus");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  if (!hasMounted) {
    return <ToolbarSkeleton />;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-5">
      <Select
        value={status ?? "all"}
        onValueChange={(value) =>
          updateParam("status", value === "all" ? undefined : value)
        }>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Status do pedido" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={deliveryStatus ?? "all"}
        onValueChange={(value) =>
          updateParam("deliveryStatus", value === "all" ? undefined : value)
        }>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Entrega" />
        </SelectTrigger>
        <SelectContent>
          {DELIVERY_STATUS_OPTIONS.map((option) => (
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
          {ORDER_SORT_BY_OPTIONS.map((option) => (
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
