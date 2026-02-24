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

  // 2. Parse everything in one clean sweep
  const parsedParams = productsSearchParamsSchema.parse(rawParams);

  const categories = await db
    .select({
      id: category.id,
      name: category.name,
    })
    .from(category);

  // 3. Pass the perfectly typed object directly to your tRPC prefetch
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
