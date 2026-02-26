import { getBestSellers } from "@/modules/products/actions";
import { BestSellersCard } from "./best-sellers-card";

export async function BestSellers() {
  const products = await getBestSellers();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {products.map((product, i) => (
        <BestSellersCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
