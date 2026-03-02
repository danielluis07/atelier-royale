import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch profit by period statistics.
 */
export const useGetProfitByPeriod = () => {
  const trpc = useTRPC();

  return useQuery(trpc.stats.getProfitByPeriod.queryOptions());
};

/**
 * Hook to fetch products by status statistics.
 */
export const useGetProductsByStatus = () => {
  const trpc = useTRPC();

  return useQuery(trpc.stats.getProductsByStatus.queryOptions());
};
