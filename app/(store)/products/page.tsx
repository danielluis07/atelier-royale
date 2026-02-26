import { ProductsClient } from "@/components/store/products/client";
import { db } from "@/db";
import { category } from "@/db/schema";
import { prefetchPublicProducts } from "@/modules/products/prefetch";
import { publicProductsSearchParamsSchema } from "@/modules/products/validations";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ProductsClientSkeleton } from "@/components/skeletons/store/products-client-skeleton";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const rawParams = await searchParams;

  const result = publicProductsSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  const categories = await db
    .select({
      id: category.id,
      name: category.name,
    })
    .from(category);

  prefetchPublicProducts(parsedParams);

  return (
    <section className="max-w-360 mx-auto px-6 lg:px-12 py-16 lg:py-24">
      {/* Page Header */}
      <div className="mb-12">
        <span className="text-xs tracking-[0.4em] uppercase font-sans text-primary mb-4 block">
          Coleção completa
        </span>
        <h1 className="font-serif text-4xl lg:text-6xl tracking-tight text-foreground">
          Nossos <span className="italic text-muted-foreground">produtos</span>
        </h1>
      </div>
      <HydrateClient>
        <ErrorBoundary
          fallback={
            <div className="max-w-360 mx-auto px-6 lg:px-12 py-32 text-center">
              <h2 className="font-serif text-2xl text-foreground mb-2">
                Algo deu errado
              </h2>
              <p className="font-sans text-sm text-muted-foreground">
                Não foi possível carregar os produtos. Tente novamente mais
                tarde.
              </p>
            </div>
          }>
          <Suspense fallback={<ProductsClientSkeleton />}>
            <ProductsClient categories={categories} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </section>
  );
};

export default ProductsPage;
