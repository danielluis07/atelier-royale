import { getFeaturedProducts } from "@/modules/products/actions";
import { isProductNew } from "@/lib/utils";
import { FeaturedProductsCard } from "@/components/store/home/feat-product-card";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((product) => {
        const isNew = isProductNew(product.createdAt);

        return (
          <FeaturedProductsCard
            key={product.id}
            product={product}
            isNew={isNew}
          />
        );
      })}
    </div>
  );
}
