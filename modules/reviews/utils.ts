import { PAGINATION } from "@/constants";
import type { ReviewsInput } from "@/modules/reviews/types";

export const normalizeReviewsParams = (
  params: Partial<ReviewsInput>,
): ReviewsInput => ({
  page: params.page ?? PAGINATION.DEFAULT_PAGE,
  perPage: params.perPage ?? PAGINATION.DEFAULT_PER_PAGE,
  search: params.search || undefined,
  isApproved: params.isApproved ?? undefined,
  rating: params.rating ?? undefined,
  userId: params.userId || undefined,
  productId: params.productId || undefined,
  sortBy: params.sortBy ?? "createdAt",
  sortOrder: params.sortOrder ?? "desc",
});
