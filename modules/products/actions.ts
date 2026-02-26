import {
  MAX_BEST_SELLERS,
  MAX_FEATURED_PRODUCTS,
  MAX_NEW_PRODUCTS,
  NEW_PRODUCT_THRESHOLD_DAYS,
} from "@/constants";
import { db } from "@/db";
import { product } from "@/db/schema";
import { subDays } from "date-fns";
import { eq, gte, and } from "drizzle-orm";

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
      })
      .from(product)
      .where(and(eq(product.isFeatured, true), eq(product.isAvailable, true)))
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
      .limit(MAX_NEW_PRODUCTS);

    return products;
  } catch (error) {
    console.error("Error fetching new products:", error);
    throw new Error("Failed to fetch new products");
  }
};

// TODO: Implement actual best-seller logic based on sales data instead of just fetching products
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
