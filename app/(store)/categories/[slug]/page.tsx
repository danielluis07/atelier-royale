import { ProductsClientSkeleton } from "@/components/skeletons/store/products-client-skeleton";
import { CategoryBanner } from "@/components/store/category/category-banner";
import { CategoryClient } from "@/components/store/category/client";
import { db } from "@/db";
import { category } from "@/db/schema";
import { prefetchPublicProducts } from "@/modules/products/prefetch";
import { publicProductsSearchParamsSchema } from "@/modules/products/validations";
import { HydrateClient } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { slug } = await params;
  const rawParams = await searchParams;

  const result = publicProductsSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  const [categoryData] = await db
    .select({
      name: category.name,
      imageUrl: category.imageUrl,
      description: category.description,
    })
    .from(category)
    .where(eq(category.slug, slug));

  if (!categoryData) {
    return (
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-32 text-center">
        <h2 className="font-serif text-2xl text-foreground mb-2">
          Categoria não encontrada
        </h2>
        <p className="font-sans text-sm text-muted-foreground">
          A categoria que você está procurando não existe. Verifique o link ou
          tente novamente mais tarde.
        </p>
      </div>
    );
  }

  prefetchPublicProducts({
    ...parsedParams,
    categorySlug: slug,
  });

  return (
    <>
      <CategoryBanner
        imageUrl={categoryData.imageUrl}
        name={categoryData.name}
        description={categoryData.description ?? undefined}
      />
      <section className="max-w-360 mx-auto px-6 lg:px-12 py-16 lg:py-24">
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
              <CategoryClient categorySlug={slug} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </section>
    </>
  );
};

export default CategoryPage;
