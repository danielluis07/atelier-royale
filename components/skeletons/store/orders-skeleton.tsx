"use client";

import { Skeleton } from "@/components/ui/skeleton";

function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-5 p-5 sm:p-6">
      {/* Icon placeholder */}
      <Skeleton className="w-11 h-11 rounded-none shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-2.5 w-32" />
        </div>
        <Skeleton className="h-3 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Chevron */}
      <Skeleton className="w-4 h-4 rounded-none shrink-0" />
    </div>
  );
}

export const OrdersSkeleton = () => {
  return (
    <div className="border border-border divide-y divide-border">
      <OrderRowSkeleton />
      <OrderRowSkeleton />
      <OrderRowSkeleton />
      <OrderRowSkeleton />
    </div>
  );
};
