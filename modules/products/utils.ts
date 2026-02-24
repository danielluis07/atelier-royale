import type { ProductsInput } from "@/modules/products/types";
import { PAGINATION } from "@/constants";

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
