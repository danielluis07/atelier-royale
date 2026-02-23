import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const SelectSkeleton = () => (
  <div className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2">
    <Skeleton className="h-4 flex-1" />
    <Skeleton className="size-4" />
  </div>
);

export const ClientSelect = dynamic(
  () => import("@/components/ui/custom/select/select-base"),
  {
    ssr: false,
    loading: () => <SelectSkeleton />,
  },
);
