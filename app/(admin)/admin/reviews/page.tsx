import { ReviewsClient } from "@/components/admin/reviews/client";
import { TableSkeleton } from "@/components/skeletons/admin/table-skeleton";
import { requireAdmin } from "@/lib/auth-utils";
import { prefetchReviews } from "@/modules/reviews/prefetch";
import { reviewsSearchParamsSchema } from "@/modules/reviews/validations";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ReviewsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  await requireAdmin();
  const rawParams = await searchParams;

  const result = reviewsSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  prefetchReviews(parsedParams);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Falha ao carregar as reviews.</p>}>
        <Suspense
          fallback={<TableSkeleton className="space-y-4" columns={5} />}>
          <ReviewsClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ReviewsPage;
