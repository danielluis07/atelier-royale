import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type {
  ProductsInput,
  PublicProductsInput,
  PublicRelatedProductsInput,
} from "@/modules/products/types";
import {
  normalizeProductsParams,
  normalizePublicProductsParams,
} from "@/modules/products/utils";

// ============================================================================
// SUSPENSE QUERIES
// ============================================================================

/**
 * Hook to fetch products.
 */
export const useProductsSuspense = (params: Partial<ProductsInput>) => {
  const trpc = useTRPC();
  const normalized = normalizeProductsParams(params);

  return useSuspenseQuery(trpc.products.list.queryOptions(normalized));
};

/**
 * Hook to fetch public products.
 */
export const usePublicProductsSuspense = (
  params: Partial<PublicProductsInput>,
) => {
  const trpc = useTRPC();
  const normalized = normalizePublicProductsParams(params);

  return useSuspenseQuery(trpc.products.listPublic.queryOptions(normalized));
};

/**
 * Hook to fetch a single product by ID.
 */
export const useProductSuspense = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.products.get.queryOptions({ id }));
};

/**
 * Hook to fetch a single public product by slug.
 */
export const usePublicProductSuspense = (slug: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.products.getPublic.queryOptions({ slug }));
};

// ============================================================================
// USE QUERY
// ============================================================================

/**
 * Hook to fetch related products
 */

export const useGetRelatedProducts = (params: PublicRelatedProductsInput) => {
  const trpc = useTRPC();

  return useQuery(trpc.products.getRelated.queryOptions(params));
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
