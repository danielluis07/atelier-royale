import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { ProductsInput } from "@/modules/products/types";
import { normalizeProductsParams } from "@/modules/products/utils";

/**
 * Hook to fetch products.
 */
export const useProductsSuspense = (params: Partial<ProductsInput>) => {
  const trpc = useTRPC();
  const normalized = normalizeProductsParams(params);

  return useSuspenseQuery(trpc.products.list.queryOptions(normalized));
};

/**
 * Hook to fetch a single product by ID.
 */
export const useProductSuspense = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.products.get.queryOptions({ id }));
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
