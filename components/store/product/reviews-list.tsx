"use client";

import { useState } from "react";
import { useGetReviewByProduct } from "@/modules/reviews/hooks";
import { ReviewsPagination } from "@/components/store/product/reviews-pagination";
import { Star, User } from "lucide-react";
import Image from "next/image";

const REVIEWS_PER_PAGE = 5;

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3.5 h-3.5 ${
          star <= rating
            ? "fill-primary text-primary"
            : "fill-transparent text-border"
        }`}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const ReviewAvatar = ({
  image,
  name,
}: {
  image: string | null;
  name: string | null;
}) => (
  <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border">
    {image ? (
      <Image
        src={image}
        alt={name ?? "Usuário"}
        width={36}
        height={36}
        className="object-cover w-full h-full"
      />
    ) : (
      <User className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
    )}
  </div>
);

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const ReviewsList = ({ productId }: { productId: string }) => {
  const [page, setPage] = useState(1);

  const { data, isFetching } = useGetReviewByProduct({
    productId,
    page,
    perPage: REVIEWS_PER_PAGE,
  });

  if (!data) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-sans text-muted-foreground">
          Carregando avaliações...
        </p>
      </div>
    );
  }

  const { reviews, summary, pagination } = data;

  return (
    <div className="flex flex-col gap-10">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center text-center md:min-w-35">
          <span className="font-serif text-5xl tracking-tight text-foreground leading-none">
            {summary.averageRating.toFixed(1)}
          </span>
          <div className="mt-2 mb-1">
            <StarDisplay rating={Math.round(summary.averageRating)} />
          </div>
          <span className="text-xs font-sans text-muted-foreground tracking-wide">
            {summary.totalReviews}{" "}
            {summary.totalReviews === 1 ? "avaliação" : "avaliações"}
          </span>
        </div>

        {/* Rating Breakdown */}
        <div className="flex flex-col gap-2">
          {summary.ratingBreakdown.map((item) => (
            <div key={item.rating} className="flex items-center gap-3">
              <span className="text-xs font-sans text-muted-foreground w-3 text-right shrink-0">
                {item.rating}
              </span>
              <Star
                className="w-3 h-3 fill-primary text-primary shrink-0"
                strokeWidth={1.5}
              />
              <div className="flex-1 h-2 bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-[11px] font-sans text-muted-foreground w-8 text-right shrink-0">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-border" />

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm font-sans text-muted-foreground">
            Este produto ainda não possui avaliações.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {reviews.map((review, index) => (
            <div key={review.id}>
              <div className="flex gap-4 py-6">
                <ReviewAvatar
                  image={review.user.image}
                  name={review.user.name}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-sm font-sans font-medium text-foreground">
                      {review.user.name ?? "Usuário"}
                    </span>
                    <span className="text-[11px] font-sans text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <StarDisplay rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
              {index < reviews.length - 1 && (
                <div className="h-px w-full bg-border" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <ReviewsPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          handlePageChange={setPage}
          isPending={isFetching}
        />
      )}
    </div>
  );
};
