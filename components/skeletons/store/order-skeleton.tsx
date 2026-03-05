import { Skeleton } from "@/components/ui/skeleton";

function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-border bg-muted/30">
      <Skeleton className="w-9 h-9 rounded-none shrink-0" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-44" />
      </div>
    </div>
  );
}

function ItemRowSkeleton() {
  return (
    <div className="flex items-center gap-5 px-6 sm:px-8 py-5">
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-3.5 w-44" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="text-right shrink-0 space-y-1.5">
        <Skeleton className="h-3.5 w-20 ml-auto" />
        <Skeleton className="h-3 w-24 ml-auto" />
      </div>
    </div>
  );
}

export default function OrderDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
      {/* Header */}
      <div className="mb-14">
        <Skeleton className="h-3 w-28 mb-6" />

        <div>
          <Skeleton className="h-2.5 w-24 mb-3" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-3.5 w-56 mt-2" />
        </div>
      </div>

      {/* Status banner */}
      <div className="border border-border bg-muted/30 p-6 sm:p-8 mb-10 flex items-center gap-5">
        <Skeleton className="w-12 h-12 rounded-none shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-12">
        <div className="hidden sm:flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-border" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative flex flex-col items-center z-10">
              <Skeleton className="w-8 h-8 rounded-none" />
              <Skeleton className="h-2.5 w-14 mt-2" />
            </div>
          ))}
        </div>

        {/* Mobile timeline */}
        <div className="sm:hidden flex flex-col gap-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <Skeleton className="w-6 h-6 rounded-none" />
                {i < 4 && <div className="w-px h-6 bg-border" />}
              </div>
              <Skeleton className="h-3 w-20 mt-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Items section */}
          <div className="border border-border">
            <SectionHeaderSkeleton />
            <div className="divide-y divide-border">
              <ItemRowSkeleton />
              <ItemRowSkeleton />
              <ItemRowSkeleton />
            </div>
            {/* Totals */}
            <div className="border-t border-border bg-muted/20 px-6 sm:px-8 py-5 space-y-2.5">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-10" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </div>
          </div>

          {/* Payment section */}
          <div className="border border-border">
            <SectionHeaderSkeleton />
            <div className="px-6 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-2.5 w-14" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-10">
          {/* Delivery section */}
          <div className="border border-border">
            <SectionHeaderSkeleton />
            <div className="px-6 py-6 space-y-5">
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-3.5 w-36" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-3.5 w-28" />
              </div>
              <div className="border-t border-border pt-5 space-y-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-2.5 w-24" />
                  <Skeleton className="h-3.5 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Summary section */}
          <div className="border border-border">
            <SectionHeaderSkeleton />
            <div className="px-6 py-6 space-y-4">
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-28" />
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-3.5 w-36" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-28" />
                <Skeleton className="h-3.5 w-36" />
              </div>
              <div className="h-px bg-border" />
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-10" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
