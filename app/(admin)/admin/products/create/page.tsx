import { CreateProductForm } from "@/components/admin/products/create-product-form";
import { ProductFormSkeleton } from "@/components/skeletons/admin/product-form-skeleton";
import { db } from "@/db";
import { category } from "@/db/schema";
import { requireAdmin } from "@/lib/auth-utils";
import { Suspense } from "react";

const CreateProductPage = async () => {
  await requireAdmin();

  const categories = await db
    .select({
      id: category.id,
      name: category.name,
    })
    .from(category);

  return (
    <Suspense fallback={<ProductFormSkeleton />}>
      <CreateProductForm categories={categories} />
    </Suspense>
  );
};

export default CreateProductPage;
