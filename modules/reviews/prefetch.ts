import { prefetch, trpc } from "@/trpc/server";
import type { ReviewsInput } from "@/modules/reviews/types";
import { normalizeReviewsParams } from "@/modules/reviews/utils";

/**
 * Prefetch reviews list
 */
export const prefetchReviews = async (params: Partial<ReviewsInput>) => {
  return prefetch(
    trpc.reviews.list.queryOptions(normalizeReviewsParams(params)),
  );
};

/**
 * Prefetch a single review by ID
 */
export const prefetchReview = async (id: string) => {
  return prefetch(trpc.reviews.get.queryOptions({ id }));
};
