"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProductsClientSkeleton() {
  return (
    <>
      <div className="space-y-5 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-10 w-full sm:w-80" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="h-px w-full bg-border" />
        <div className="flex flex-wrap items-center gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-44" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
        {[...Array(8)].map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-3/4 w-full mb-5" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
