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
  USER_STATUS_OPTIONS,
  USER_SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
} from "@/constants";
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
    </div>
  );
};

export const UsersToolbar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useHasMounted();

  // 1. Read "banned" instead of "status"
  const banned = searchParams.get("banned") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

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

  // 2. Check if "banned" is active
  const hasActiveFilters = banned !== undefined;

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("banned"); // 3. Delete "banned"
    params.delete("sortBy");
    params.delete("sortOrder");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  if (!hasMounted) {
    return <ToolbarSkeleton />;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
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

      {/* 4. Use the banned variable and update the "banned" param */}
      <Select
        value={banned ?? "all"}
        onValueChange={(value) =>
          updateParam("banned", value === "all" ? undefined : value)
        }>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {USER_STATUS_OPTIONS.map((option) => (
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
          {USER_SORT_BY_OPTIONS.map((option) => (
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
          {SORT_ORDER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
