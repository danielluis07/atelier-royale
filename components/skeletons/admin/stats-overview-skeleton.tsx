import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCardSkeleton = () => {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="p-2 bg-muted rounded-md">
          <Skeleton className="w-4 h-4" />
        </div>
      </div>
      <CardContent className="p-0">
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
};

export const StatsOverviewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
};
