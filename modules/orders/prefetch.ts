import { prefetch, trpc } from "@/trpc/server";
import { normalizeOrdersParams } from "@/modules/orders/utils";
import type { OrdersInput } from "@/modules/orders/types";

/**
 * Prefetch orders
 */
export const prefetchOrders = async (params: Partial<OrdersInput>) => {
  return prefetch(trpc.orders.list.queryOptions(normalizeOrdersParams(params)));
};
