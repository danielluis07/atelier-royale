import { requireAdmin } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { db } from "@/db";
import { category } from "@/db/schema";
import { UpdateProductForm } from "@/components/admin/products/update-product-form";
import { prefetchProduct } from "@/modules/products/prefetch";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;

  const categories = await db
    .select({
      id: category.id,
      name: category.name,
    })
    .from(category);

  prefetchProduct(id);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Falha ao carregar produto.</p>}>
        <Suspense fallback={<p>Carregando produto...</p>}>
          <UpdateProductForm id={id} categories={categories} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default ProductPage;
