"use client";

import { DataTable } from "@/components/ui/custom/data-table";
import { columns } from "@/components/admin/orders/columns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataPagination } from "@/components/ui/custom/data-pagination";
import { DataSearch } from "@/components/ui/custom/data-search";
import { useURLSearch } from "@/hooks/use-url-search";
import { useCallback } from "react";
import { OrdersToolbar } from "@/components/admin/orders/toolbar";
import { useOrdersSuspense } from "@/modules/orders/hooks";
import { ordersSearchParamsSchema } from "@/modules/orders/validations";

export const OrdersClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawParams = Object.fromEntries(searchParams.entries());

  const result = ordersSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  const {
    searchInput,
    setSearchInput,
    isPending: isSearchPending,
  } = useURLSearch();

  const { data, isFetching } = useOrdersSuspense(parsedParams);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const orders = data.orders;
  const pagination = data.pagination;

  return (
    <>
      <DataSearch
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchPlaceholder="Procurar por cliente, email ou #pedido"
      />
      <OrdersToolbar />
      <DataTable data={orders} columns={columns} />
      {pagination && (
        <div className="mt-5">
          <DataPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            handlePageChange={handlePageChange}
            isPending={isFetching || isSearchPending}
            label="pedido"
          />
        </div>
      )}
    </>
  );
};
