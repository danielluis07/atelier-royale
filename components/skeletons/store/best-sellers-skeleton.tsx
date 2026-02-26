import { Skeleton } from "@/components/ui/skeleton";
import { MAX_BEST_SELLERS } from "@/constants";

export function BestSellersSkeleton({
  count = MAX_BEST_SELLERS,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-6 items-stretch border border-border overflow-hidden">
          {/* Image */}
          <div className="relative w-40 lg:w-55 shrink-0">
            <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
          </div>

          {/* Content */}
          <div className="flex-1 py-6 pr-6 flex flex-col justify-between min-h-45">
            <div>
              {/* Rank + Brand */}
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-9 lg:h-10 w-10" />
                <Skeleton className="h-2.5 w-20" />
              </div>

              {/* Product name */}
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>

            <div className="flex items-end justify-between">
              {/* Price */}
              <Skeleton className="h-4 w-16" />
              {/* Sold count + icon */}
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
