import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch revenue by period statistics.
 */
export const useGetRevenueByPeriod = () => {
  const trpc = useTRPC();

  return useQuery(trpc.stats.getRevenueByPeriod.queryOptions());
};

/**
 * Hook to fetch products by status statistics.
 */
export const useGetProductsByStatus = () => {
  const trpc = useTRPC();

  return useQuery(trpc.stats.getProductsByStatus.queryOptions());
};
