import { prefetch, trpc } from "@/trpc/server";

/**
 * Prefetch categories
 */
export const prefetchCategories = async () => {
  return prefetch(trpc.categories.list.queryOptions());
};
