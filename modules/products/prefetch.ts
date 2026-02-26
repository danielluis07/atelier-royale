import { prefetch, trpc } from "@/trpc/server";
import type {
  ProductsInput,
  PublicProductsInput,
} from "@/modules/products/types";
import {
  normalizeProductsParams,
  normalizePublicProductsParams,
} from "@/modules/products/utils";

/**
 * Prefetch product list
 */
export const prefetchProducts = async (params: Partial<ProductsInput>) => {
  return prefetch(
    trpc.products.list.queryOptions(normalizeProductsParams(params)),
  );
};

/**
 * Prefetch public product list
 */
export const prefetchPublicProducts = async (
  params: Partial<PublicProductsInput>,
) => {
  return prefetch(
    trpc.products.listPublic.queryOptions(
      normalizePublicProductsParams(params),
    ),
  );
};

/**
 * Prefetch a single product by ID
 */
export const prefetchProduct = async (id: string) => {
  return prefetch(trpc.products.get.queryOptions({ id }));
};

/**
 * Prefetch a single public product by slug
 */
export const prefetchPublicProduct = async (slug: string) => {
  return prefetch(trpc.products.getPublic.queryOptions({ slug }));
};
