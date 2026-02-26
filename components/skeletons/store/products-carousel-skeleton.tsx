import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProductsCarouselSkeleton({
  className,
  count = 4,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <section className={cn("py-24 lg:py-32", className)}>
      <div className="max-w-360 mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          {/* Label / heading */}
          <Skeleton className="h-8 lg:h-10 w-56" />

          <div className="flex items-center gap-4">
            {/* Nav arrows */}
            <div className="hidden lg:flex items-center gap-2">
              <Skeleton className="w-11 h-11 rounded-none" />
              <Skeleton className="w-11 h-11 rounded-none" />
            </div>
            {/* "Ver tudo" link */}
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Carousel Items */}
      <div className="max-w-360 mx-auto px-6 lg:px-12">
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="shrink-0 basis-1/2 lg:basis-1/4">
              {/* ProductCard skeleton */}
              <div className="flex flex-col">
                {/* Image */}
                <div className="relative aspect-3/4 w-full mb-6">
                  <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
                </div>

                {/* Card info */}
                <div className="space-y-2">
                  {/* Brand / category */}
                  <Skeleton className="h-2.5 w-16" />
                  {/* Name */}
                  <Skeleton className="h-5 w-3/4" />
                  {/* Price */}
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
