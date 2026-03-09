import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch sales evolution data for a specified range of days.
 */
export const useGetSalesEvolution = (input: { rangeDays: 7 | 30 | 90 }) => {
  const trpc = useTRPC();

  return useQuery(trpc.stats.getSalesEvolution.queryOptions(input));
};
