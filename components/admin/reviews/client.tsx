"use client";

import { DataTable } from "@/components/ui/custom/data-table";
import { columns } from "@/components/admin/reviews/columns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataPagination } from "@/components/ui/custom/data-pagination";
import { DataSearch } from "@/components/ui/custom/data-search";
import { useURLSearch } from "@/hooks/use-url-search";
import { useCallback } from "react";
import { reviewsSearchParamsSchema } from "@/modules/reviews/validations";
import type { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { useConfirm } from "@/providers/confirm-provider";
import { useDeleteReviews, useReviewsSuspense } from "@/modules/reviews/hooks";
import { ReviewsToolbar } from "@/components/admin/reviews/toolbar";

export const ReviewsClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawParams = Object.fromEntries(searchParams.entries());

  const result = reviewsSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  const {
    searchInput,
    setSearchInput,
    isPending: isSearchPending,
  } = useURLSearch();

  const { closeConfirm, setPending } = useConfirm();

  const { data, isFetching } = useReviewsSuspense(parsedParams);

  const { mutateAsync } = useDeleteReviews();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const onDelete = async (
    row: Row<{
      id: string;
      rating: number;
      comment: string | null;
      isApproved: boolean;
      createdAt: Date;
      user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
      };
      product: {
        id: string;
        name: string;
        slug: string;
        imageUrl: string;
      };
    }>[],
  ) => {
    const ids = row.map((r) => r.original.id);

    toast.loading(`Deletando ${ids.length} produto(s)...`, {
      id: "delete-reviews",
    });
    setPending(true);

    try {
      await mutateAsync({ ids });

      closeConfirm();
      toast.success("Reviews(s) deletada(s) com sucesso!", {
        id: "delete-reviews",
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao deletar reviews(s)", {
        id: "delete-reviews",
      });
    } finally {
      setPending(false);
    }
  };

  const products = data.reviews;
  const pagination = data.pagination;

  return (
    <>
      <div className="flex items-center justify-between">
        <DataSearch
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchPlaceholder="Procurar"
        />
        <ReviewsToolbar />
      </div>
      <div
        className={
          isFetching || isSearchPending ? "pointer-events-none opacity-70" : ""
        }>
        <DataTable
          data={products}
          columns={columns}
          getRowId={(row) => String(row.id)}
          onDelete={onDelete}
        />
        {pagination && (
          <div className="mt-5">
            <DataPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              handlePageChange={handlePageChange}
              isPending={isFetching || isSearchPending}
              label="produto"
            />
          </div>
        )}
      </div>
    </>
  );
};
