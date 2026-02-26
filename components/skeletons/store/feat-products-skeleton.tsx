import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FEATURED_PRODUCTS } from "@/constants";

export function FeaturedProductsSkeleton({
  count = MAX_FEATURED_PRODUCTS,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-3/4 overflow-hidden mb-6">
            <Skeleton className="absolute inset-0 w-full h-full" />
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            {/* Brand */}
            <Skeleton className="h-3 w-16" />

            {/* Product Name */}
            <Skeleton className="h-6 w-3/4" />

            {/* Price + Stars */}
            <div className="flex items-center justify-between pt-0.5">
              <Skeleton className="h-4 w-20" />
              {/* Stars row */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="w-3 h-3 rounded-none" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
