import {
  MAX_BEST_SELLERS,
  MAX_FEATURED_PRODUCTS,
  MAX_NEW_PRODUCTS,
  NEW_PRODUCT_THRESHOLD_DAYS,
} from "@/constants";
import { db } from "@/db";
import { product, review } from "@/db/schema";
import { subDays } from "date-fns";
import { eq, gte, and, desc, avg } from "drizzle-orm";

export const getFeaturedProducts = async () => {
  try {
    const products = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        imageUrl: product.imageUrl,
        basePrice: product.basePrice,
        createdAt: product.createdAt,
        rating: avg(review.rating),
      })
      .from(product)
      .leftJoin(review, eq(review.productId, product.id))
      .where(and(eq(product.isFeatured, true), eq(product.isAvailable, true)))
      .groupBy(product.id)
      .orderBy(desc(product.createdAt))
      .limit(MAX_FEATURED_PRODUCTS);

    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Failed to fetch featured products");
  }
};

export const getNewProducts = async () => {
  const thresholdDate = subDays(new Date(), NEW_PRODUCT_THRESHOLD_DAYS);

  try {
    const products = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        imageUrl: product.imageUrl,
        basePrice: product.basePrice,
      })
      .from(product)
      .where(
        and(
          gte(product.createdAt, thresholdDate),
          eq(product.isAvailable, true),
        ),
      )
      .orderBy(desc(product.createdAt))
      .limit(MAX_NEW_PRODUCTS);

    return products;
  } catch (error) {
    console.error("Error fetching new products:", error);
    throw new Error("Failed to fetch new products");
  }
};

// TODO: Implement actual best-seller logic based on sales data instead of just fetching products
// TODO: Once sales data is implemented, order by sales count DESC
export const getBestSellers = async () => {
  try {
    const products = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        imageUrl: product.imageUrl,
        basePrice: product.basePrice,
      })
      .from(product)
      .where(eq(product.isAvailable, true))
      .limit(MAX_BEST_SELLERS);

    return products;
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    throw new Error("Failed to fetch best sellers");
  }
};
