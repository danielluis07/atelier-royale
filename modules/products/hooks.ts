import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

/**
 * Hook to fetch products.
 */
export const useProductsSuspense = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.products.list.queryOptions());
};

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to create a new product.
 */
export const useCreateProduct = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.products.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.products.list.queryKey(),
        });
      },
    }),
  );
};

/**
 * Hook to update a product.
 */
export const useUpdateProduct = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.products.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.products.list.queryKey(),
        });
      },
    }),
  );
};
