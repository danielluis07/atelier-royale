import { OrdersClient } from "@/components/admin/orders/client";
import { TableSkeleton } from "@/components/skeletons/admin/table-skeleton";
import { requireAdmin } from "@/lib/auth-utils";
import { prefetchOrders } from "@/modules/orders/prefetch";
import { ordersSearchParamsSchema } from "@/modules/orders/validations";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  await requireAdmin();
  const rawParams = await searchParams;

  const result = ordersSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  prefetchOrders(parsedParams);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Falha ao carregar pedidos.</p>}>
        <Suspense
          fallback={<TableSkeleton className="space-y-4" columns={2} />}>
          <OrdersClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default OrdersPage;
