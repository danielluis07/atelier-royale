import type { OrdersInput } from "@/modules/orders/types";
import { PAGINATION } from "@/constants";

export const normalizeOrdersParams = (
  params: Partial<OrdersInput>,
): OrdersInput => ({
  page: params.page ?? PAGINATION.DEFAULT_PAGE,
  perPage: params.perPage ?? PAGINATION.DEFAULT_PER_PAGE,
  search: params.search || undefined,
  status: params.status ?? undefined,
  deliveryStatus: params.deliveryStatus ?? undefined,
  sortBy: params.sortBy ?? "createdAt",
  sortOrder: params.sortOrder ?? "desc",
});
