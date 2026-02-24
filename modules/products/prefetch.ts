import { prefetch, trpc } from "@/trpc/server";

/**
 * Prefetch product list
 */
export const prefetchProducts = async () => {
  return prefetch(trpc.products.list.queryOptions());
};

/**
 * Prefetch a single product by ID
 */
export const prefetchProduct = async (id: string) => {
  return prefetch(trpc.products.get.queryOptions({ id }));
};
