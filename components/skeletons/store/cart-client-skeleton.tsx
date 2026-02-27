"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const CartClientSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          {/* "Continuar comprando" link */}
          <div className="mb-4 inline-flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3 w-40" />
          </div>

          {/* Title */}
          <Skeleton className="h-9 lg:h-10 w-44 lg:w-56" />
        </div>

        {/* "Limpar sacola" button */}
        <Skeleton className="h-3 w-28 self-start sm:self-auto" />
      </div>

      {/* Grid: Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Column labels (desktop) */}
          <div className="hidden sm:flex items-center justify-between pb-4 border-b border-border mb-0">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
          </div>

          {/* Item cards skeletons */}
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-6">
                <div className="flex gap-4">
                  {/* Image */}
                  <Skeleton className="h-24 w-24 rounded-md" />

                  <div className="flex-1">
                    {/* Product name */}
                    <Skeleton className="h-4 w-3/5" />
                    {/* Variant / details */}
                    <Skeleton className="h-3 w-2/5 mt-3" />

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-12 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                      </div>

                      {/* Line total */}
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-border p-6">
            <Skeleton className="h-5 w-32" />
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <Skeleton className="h-11 w-full mt-6 rounded-md" />
            <Skeleton className="h-3 w-3/4 mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
