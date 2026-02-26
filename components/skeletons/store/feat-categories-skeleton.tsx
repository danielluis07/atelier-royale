import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedCategoriesSkeleton({ count = 5 }: { count?: number }) {
  const getCardClasses = (index: number, totalItems: number) => {
    const positionInBlock = index % 5;
    const blockIndex = Math.floor(index / 5);
    const isLastBlock = blockIndex === Math.floor((totalItems - 1) / 5);
    const itemsInThisBlock = isLastBlock
      ? totalItems % 5 === 0
        ? 5
        : totalItems % 5
      : 5;

    const isRow1 = positionInBlock < 3;
    const heightClass = isRow1 ? "h-85 lg:h-140" : "h-75 lg:h-95";

    if (!isLastBlock || itemsInThisBlock === 5) {
      if (positionInBlock === 0 || positionInBlock === 2)
        return `${heightClass} lg:col-span-1`;
      if (
        positionInBlock === 1 ||
        positionInBlock === 3 ||
        positionInBlock === 4
      )
        return `${heightClass} lg:col-span-2`;
    }

    if (itemsInThisBlock === 1) {
      return `${heightClass} lg:col-span-4`;
    }
    if (itemsInThisBlock === 2) {
      return `${heightClass} lg:col-span-2`;
    }
    if (itemsInThisBlock === 3) {
      if (positionInBlock === 0 || positionInBlock === 2)
        return `${heightClass} lg:col-span-1`;
      if (positionInBlock === 1) return `${heightClass} lg:col-span-2`;
    }
    if (itemsInThisBlock === 4) {
      if (positionInBlock === 0 || positionInBlock === 2)
        return `${heightClass} lg:col-span-1`;
      if (positionInBlock === 1) return `${heightClass} lg:col-span-2`;
      if (positionInBlock === 3) return `h-75 lg:h-95 lg:col-span-4`;
    }

    return `${heightClass} lg:col-span-1`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={getCardClasses(index, count)} />
      ))}
    </div>
  );
}
