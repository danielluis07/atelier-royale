"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useHasMounted } from "@/hooks/use-has-mounted";

export const ProductsPagination = ({
  page,
  totalPages,
  total,
  handlePageChange,
  label,
  isPending,
}: {
  page: number;
  totalPages: number;
  total: number;
  handlePageChange: (page: number) => void;
  label: string;
  isPending: boolean;
}) => {
  const hasMounted = useHasMounted();

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {total} {total > 1 ? `${label}s encontrados` : `${label} encontrado`}
      </p>

      <div className="flex items-center gap-3">
        <Pagination>
          <PaginationContent>
            <PaginationItem className="border border-border flex items-center justify-center transition-all duration-300">
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                aria-disabled={page === 1 || isPending || !hasMounted}
                className={
                  page === 1 || isPending || !hasMounted
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-primary/5 hover:border-primary"
                }
              />
            </PaginationItem>

            <span className="flex items-center px-2 text-sm">
              Página {page} de {totalPages}
            </span>

            <PaginationItem className="border border-border flex items-center justify-center transition-all duration-300">
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                aria-disabled={
                  page >= totalPages ||
                  totalPages === 0 ||
                  isPending ||
                  !hasMounted
                }
                className={
                  page >= totalPages ||
                  totalPages === 0 ||
                  isPending ||
                  !hasMounted
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-primary/5 hover:border-primary"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
