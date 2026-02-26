import { UsersClient } from "@/components/admin/users/client";
import { TableSkeleton } from "@/components/skeletons/admin/table-skeleton";
import { requireAdmin } from "@/lib/auth-utils";
import { prefetchUsers } from "@/modules/users/prefetch";
import { usersSearchParamsSchema } from "@/modules/users/validations";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  await requireAdmin();
  const rawParams = await searchParams;

  const result = usersSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  prefetchUsers(parsedParams);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Falha ao carregar usuários.</p>}>
        <Suspense
          fallback={<TableSkeleton className="space-y-4" columns={5} />}>
          <UsersClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default UsersPage;
