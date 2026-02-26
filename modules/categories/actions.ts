import { db } from "@/db";
import { category } from "@/db/schema";

export const getCategories = async () => {
  try {
    const categories = await db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
        imageUrl: category.imageUrl,
      })
      .from(category);

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
