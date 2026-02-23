import { CategoriesClient } from "@/components/admin/categories/client";
import { requireAdmin } from "@/lib/auth-utils";
import { prefetchCategories } from "@/modules/categories/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CategoriesPage = async () => {
  await requireAdmin();

  prefetchCategories();

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Falha ao carregar categorias.</p>}>
        <Suspense fallback={<p>Carregando categorias...</p>}>
          <CategoriesClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default CategoriesPage;
