import type {
  ProductsInput,
  PublicProductsInput,
} from "@/modules/products/types";
import { PAGINATION, STORE_PAGINATION } from "@/constants";

export const normalizeProductsParams = (
  params: Partial<ProductsInput>,
): ProductsInput => ({
  page: params.page ?? PAGINATION.DEFAULT_PAGE,
  perPage: params.perPage ?? PAGINATION.DEFAULT_PER_PAGE,
  search: params.search || undefined,
  isAvailable: params.isAvailable ?? undefined,
  categoryId: params.categoryId || undefined,
  sortBy: params.sortBy ?? "createdAt",
  sortOrder: params.sortOrder ?? "desc",
});

export const normalizePublicProductsParams = (
  params: Partial<PublicProductsInput>,
): PublicProductsInput => ({
  page: params.page ?? STORE_PAGINATION.DEFAULT_PAGE,
  perPage: params.perPage ?? STORE_PAGINATION.DEFAULT_PER_PAGE,
  search: params.search || undefined,
  categorySlug: params.categorySlug || undefined,
  categoryId: params.categoryId || undefined,
  sortBy: params.sortBy ?? "createdAt",
  sortOrder: params.sortOrder ?? "desc",
});
