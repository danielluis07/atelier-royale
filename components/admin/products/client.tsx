"use client";

import { DataTable } from "@/components/ui/custom/data-table";
import { columns } from "@/components/admin/products/columns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataPagination } from "@/components/ui/custom/data-pagination";
import { DataSearch } from "@/components/ui/custom/data-search";
import { useURLSearch } from "@/hooks/use-url-search";
import { useCallback } from "react";
import { useProductsSuspense } from "@/modules/products/hooks";
import { productsSearchParamsSchema } from "@/modules/products/validations";
import { ProductsToolbar } from "@/components/admin/products/toolbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const ProductsClient = ({
  categories,
}: {
  categories: { id: string; name: string }[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawParams = Object.fromEntries(searchParams.entries());

  const result = productsSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  const {
    searchInput,
    setSearchInput,
    isPending: isSearchPending,
  } = useURLSearch();

  const { data, isFetching } = useProductsSuspense(parsedParams);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const products = data.products;
  const pagination = data.pagination;

  return (
    <>
      <div className="flex items-center justify-between">
        <DataSearch
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchPlaceholder="Procurar por nome ou marca"
        />
        <Button asChild>
          <Link href="/admin/products/create">
            <Plus />
            Criar Produto
          </Link>
        </Button>
      </div>
      <ProductsToolbar categories={categories} />
      <DataTable data={products} columns={columns} className="min-h-10" />
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
    </>
  );
};
