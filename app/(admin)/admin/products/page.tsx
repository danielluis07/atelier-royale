import { requireAdmin } from "@/lib/auth-utils";

const ProductsPage = async () => {
  await requireAdmin();

  return (
    <div>
      <p>Products Page</p>
    </div>
  );
};

export default ProductsPage;
