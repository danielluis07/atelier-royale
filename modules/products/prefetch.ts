import { prefetch, trpc } from "@/trpc/server";
import type { ProductsInput } from "@/modules/products/types";
import { normalizeProductsParams } from "@/modules/products/utils";

/**
 * Prefetch product list
 */
export const prefetchProducts = async (params: Partial<ProductsInput>) => {
  return prefetch(
    trpc.products.list.queryOptions(normalizeProductsParams(params)),
  );
};

/**
 * Prefetch a single product by ID
 */
export const prefetchProduct = async (id: string) => {
  return prefetch(trpc.products.get.queryOptions({ id }));
};
