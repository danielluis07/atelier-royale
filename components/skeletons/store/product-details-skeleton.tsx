import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Image skeleton */}
      <Skeleton className="aspect-square lg:aspect-3/4 w-full" />

      {/* Details skeleton */}
      <div className="flex flex-col">
        <Skeleton className="h-2.5 w-24 mb-3" />
        <Skeleton className="h-10 w-72 mb-2" />
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-7 w-32 mb-8" />
        <div className="h-px w-full bg-border mb-8" />
        <Skeleton className="h-3 w-20 mb-4" />
        <div className="flex gap-2 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-14 h-11" />
          ))}
        </div>
        <Skeleton className="h-3 w-20 mb-4" />
        <Skeleton className="h-11 w-36 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-11 w-full mb-10" />
        <Skeleton className="h-3 w-20 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
