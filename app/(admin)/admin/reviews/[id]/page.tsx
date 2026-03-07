import { requireAdmin } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { prefetchReview } from "@/modules/reviews/prefetch";
import { ReviewDetails } from "@/components/admin/reviews/review-details";
import { ReviewDetailsSkeleton } from "@/components/skeletons/admin/review-details-skeleton";

const ReviewPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;

  prefetchReview(id);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Falha ao carregar review.</p>}>
        <Suspense fallback={<ReviewDetailsSkeleton />}>
          <ReviewDetails id={id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ReviewPage;
