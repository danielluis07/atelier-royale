import { UsersClient } from "@/components/admin/users/client";
import { PAGINATION } from "@/constants";
import { requireAdmin } from "@/lib/auth-utils";
import { prefetchUsers } from "@/modules/users/prefetch";
import {
  userSortBySchema,
  userSortOrderSchema,
} from "@/modules/users/validations";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  await requireAdmin();
  const params = await searchParams;

  const page = Number(params.page) || PAGINATION.DEFAULT_PAGE;
  const search = typeof params.search === "string" ? params.search : undefined;

  // 1. Extract the string value (ignoring arrays if someone passes ?banned=true&banned=false)
  const bannedStr =
    typeof params.banned === "string" ? params.banned : undefined;

  // 2. Convert that string into a strict boolean, or leave it undefined
  const banned =
    bannedStr === "true" ? true : bannedStr === "false" ? false : undefined;
  const sortByParse = userSortBySchema.safeParse(params.sortBy);
  const sortBy = sortByParse.success ? sortByParse.data : "createdAt";

  const sortOrderParse = userSortOrderSchema.safeParse(params.sortOrder);
  const sortOrder = sortOrderParse.success ? sortOrderParse.data : "desc";

  prefetchUsers({
    page,
    search,
    banned,
    sortBy,
    sortOrder,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Falha ao carregar usuários.</p>}>
        <Suspense fallback={<p>Carregando usuários...</p>}>
          <UsersClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default UsersPage;
