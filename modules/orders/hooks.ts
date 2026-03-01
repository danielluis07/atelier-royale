import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { normalizeOrdersParams } from "@/modules/orders/utils";
import type { OrdersInput } from "@/modules/orders/types";

/**
 * Hook to fetch orders.
 */
export const useOrdersSuspense = (params: Partial<OrdersInput>) => {
  const trpc = useTRPC();
  const normalized = normalizeOrdersParams(params);

  return useSuspenseQuery(trpc.orders.list.queryOptions(normalized));
};
