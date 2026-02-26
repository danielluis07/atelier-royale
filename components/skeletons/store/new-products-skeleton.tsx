import { Skeleton } from "@/components/ui/skeleton";
import { MAX_NEW_PRODUCTS } from "@/constants";

export function NewProductsCarouselSkeleton({
  count = MAX_NEW_PRODUCTS,
}: {
  count?: number;
}) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-360 mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="space-y-4">
            {/* "Novidades" label */}
            <Skeleton className="h-3 w-24" />
            {/* Heading line 1 */}
            <Skeleton className="h-10 lg:h-14 w-40" />
            {/* Heading line 2 (italic) */}
            <Skeleton className="h-10 lg:h-14 w-52" />
          </div>

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
              {/* Full-bleed card image with overlay text simulation */}
              <div className="relative aspect-3/4 w-full overflow-hidden">
                <Skeleton className="absolute inset-0 w-full h-full" />
                {/* Text overlay area at bottom */}
                <div className="absolute bottom-0 left-0 w-full p-6 space-y-2">
                  <Skeleton className="h-2.5 w-14 bg-white/20" />
                  <Skeleton className="h-6 w-4/5 bg-white/20" />
                  <Skeleton className="h-5 w-3/5 bg-white/20" />
                  <div className="pt-2 border-t border-white/10">
                    <Skeleton className="h-3 w-16 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
