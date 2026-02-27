"use client";

import { useURLSearch } from "@/hooks/use-url-search";
import { usePublicProductsSuspense } from "@/modules/products/hooks";
import { publicProductsSearchParamsSchema } from "@/modules/products/validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ProductsPagination } from "@/components/store/products/products-pagination";
import { ProductsSearch } from "@/components/store/products/products-search";
import { PackageOpen } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { CategoryToolbar } from "@/components/store/category/category-toolbar";

export const CategoryClient = ({ categorySlug }: { categorySlug: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawParams = Object.fromEntries(searchParams.entries());

  const result = publicProductsSearchParamsSchema.safeParse(rawParams);
  const parsedParams = result.success ? result.data : {};

  const { searchInput, setSearchInput } = useURLSearch();

  const { data, isFetching } = usePublicProductsSuspense({
    ...parsedParams,
    categorySlug,
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const products = data.products;
  const pagination = data.pagination;

  return (
    <>
      {/* Search + Toolbar Row */}
      <div className="space-y-5 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ProductsSearch
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchPlaceholder="Buscar por nome ou marca..."
          />
          <span className="text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground">
            {pagination.total} {pagination.total === 1 ? "produto" : "produtos"}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        <CategoryToolbar />
      </div>

      {/* Product Grid */}
      <div className="transition-opacity duration-300">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border border-border flex items-center justify-center mb-6">
              <PackageOpen
                className="w-7 h-7 text-muted-foreground"
                strokeWidth={1}
              />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="font-sans text-sm text-muted-foreground max-w-sm">
              Tente ajustar os filtros ou buscar por outro termo para encontrar
              o que procura.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((product, index) => (
              <ProductCard key={product.id} index={index} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-16 pt-8 border-t border-border">
          <ProductsPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            handlePageChange={handlePageChange}
            label="produto"
            isPending={isFetching}
          />
        </div>
      )}
    </>
  );
};
