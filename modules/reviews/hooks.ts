import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type {
  ReviewByProductInput,
  ReviewsInput,
} from "@/modules/reviews/types";
import { normalizeReviewsParams } from "@/modules/reviews/utils";

// ============================================================================
// SUSPENSE QUERIES
// ============================================================================

/**
 * Hook to fetch reviews.
 */
export const useReviewsSuspense = (params: Partial<ReviewsInput>) => {
  const trpc = useTRPC();
  const normalized = normalizeReviewsParams(params);

  return useSuspenseQuery(trpc.reviews.list.queryOptions(normalized));
};

/**
 * Hook to fetch a single review by ID.
 */
export const useReviewSuspense = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.reviews.get.queryOptions({ id }));
};

// ============================================================================
// USE QUERY
// ============================================================================

export const useGetReviewByProduct = (params: ReviewByProductInput) => {
  const trpc = useTRPC();

  return useQuery(trpc.reviews.getByProduct.queryOptions(params));
};

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to create a new review.
 */
export const useCreateReview = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.getByProduct.queryKey(),
        });
      },
    }),
  );
};

/**
 * Hook to update the approval status of a review.
 */
export const useSetReviewApproval = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.reviews.setApproval.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.get.queryKey(),
        });
      },
    }),
  );
};

/**
 * Hook to delete reviews.
 */
export const useDeleteReviews = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.reviews.deleteMany.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.list.queryKey(),
        });
      },
    }),
  );
};
