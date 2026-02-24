import { ProductsClient } from "@/components/admin/products/client";
import { db } from "@/db";
import { category } from "@/db/schema";
import { requireAdmin } from "@/lib/auth-utils";
import { prefetchProducts } from "@/modules/products/prefetch";
import { productsSearchParamsSchema } from "@/modules/products/validations";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  await requireAdmin();
  const rawParams = await searchParams;

  const result = productsSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  const categories = await db
    .select({
      id: category.id,
      name: category.name,
    })
    .from(category);

  prefetchProducts(parsedParams);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Falha ao carregar produtos.</p>}>
        <Suspense fallback={<p>Carregando produtos...</p>}>
          <ProductsClient categories={categories} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ProductsPage;
