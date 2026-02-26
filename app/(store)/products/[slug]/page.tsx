import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { prefetchPublicProduct } from "@/modules/products/prefetch";
import { ProductClient } from "@/components/store/product/client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductDetailsSkeleton } from "@/components/skeletons/store/product-details-skeleton";
import { ProductDetailsError } from "@/components/errors/product-detail-error";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  prefetchPublicProduct(slug);

  return (
    <section className="max-w-360 mx-auto px-6 lg:px-12 py-8 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 lg:mb-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors duration-300">
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Voltar aos produtos
        </Link>
      </nav>
      <HydrateClient>
        <ErrorBoundary fallback={<ProductDetailsError />}>
          <Suspense fallback={<ProductDetailsSkeleton />}>
            <ProductClient slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </section>
  );
};

export default ProductPage;
