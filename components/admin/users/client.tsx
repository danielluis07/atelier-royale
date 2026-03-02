"use client";

import { DataTable } from "@/components/ui/custom/data-table";
import { columns } from "@/components/admin/users/columns";
import { useUsersSuspense } from "@/modules/users/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataPagination } from "@/components/ui/custom/data-pagination";
import { DataSearch } from "@/components/ui/custom/data-search";
import { useURLSearch } from "@/hooks/use-url-search";
import { useCallback } from "react";
import { UsersToolbar } from "@/components/admin/users/toolbar";
import { usersSearchParamsSchema } from "@/modules/users/validations";

export const UsersClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawParams = Object.fromEntries(searchParams.entries());

  const result = usersSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  const {
    searchInput,
    setSearchInput,
    isPending: isSearchPending,
  } = useURLSearch();

  const { data, isFetching } = useUsersSuspense(parsedParams);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const users = data.users;
  const pagination = data.pagination;

  return (
    <>
      <div className="flex items-center justify-between">
        <DataSearch searchInput={searchInput} setSearchInput={setSearchInput} />
        <UsersToolbar />
      </div>
      <div
        className={
          isFetching || isSearchPending ? "pointer-events-none opacity-70" : ""
        }>
        <DataTable data={users} columns={columns} />
        {pagination && (
          <div className="mt-5">
            <DataPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              handlePageChange={handlePageChange}
              isPending={isFetching || isSearchPending}
              label="usuário"
            />
          </div>
        )}
      </div>
    </>
  );
};
