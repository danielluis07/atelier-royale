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

export const ProductsClient = ({
  categories,
}: {
  categories: { id: string; name: string }[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 2. Convert URLSearchParams to a plain object
  const rawParams = Object.fromEntries(searchParams.entries());

  // 3. Parse everything in one clean line, falling back to defaults automatically
  const parsedParams = productsSearchParamsSchema.parse(rawParams);

  const {
    searchInput,
    setSearchInput,
    isPending: isSearchPending,
  } = useURLSearch();

  // 4. Pass the safely parsed and typed params directly to tRPC
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
        <ProductsToolbar categories={categories} />
      </div>
      <DataTable data={products} columns={columns} />
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
