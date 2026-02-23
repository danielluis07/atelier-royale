import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

/**
 * Hook to fetch categories.
 */
export const useCategoriesSuspense = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.categories.list.queryOptions());
};

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to create a new category.
 */
export const useCreateCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.categories.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.categories.list.queryKey(),
        });
      },
    }),
  );
};

/**
 * Hook to update a category.
 */
export const useUpdateCategory = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.categories.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.categories.list.queryKey(),
        });
      },
    }),
  );
};

/**
 * Hook to delete categories.
 */
export const useDeleteCategories = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.categories.deleteMany.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.categories.list.queryKey(),
        });
      },
    }),
  );
};
