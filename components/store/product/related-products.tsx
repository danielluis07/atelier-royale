"use client";

import { useGetRelatedProducts } from "@/modules/products/hooks";
import { ProductsCarousel } from "@/components/store/products-carousel";
import { ProductsCarouselSkeleton } from "@/components/skeletons/store/products-carousel-skeleton";

export const RelatedProducts = ({
  productId,
  categoryId,
}: {
  productId: string;
  categoryId: string;
}) => {
  const { data, isLoading } = useGetRelatedProducts({
    productId,
    categoryId,
  });

  if (isLoading) {
    return <ProductsCarouselSkeleton />;
  }

  return <ProductsCarousel label="Produtos Relacionados" products={data} />;
};
