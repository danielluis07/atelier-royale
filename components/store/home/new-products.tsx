import { NewProductsCarousel } from "@/components/store/home/new-products-carousel";
import { getNewProducts } from "@/modules/products/actions";

export async function NewProducts() {
  const products = await getNewProducts();

  return <NewProductsCarousel products={products} />;
}
