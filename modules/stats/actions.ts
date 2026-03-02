import { db } from "@/db";
import { order, product } from "@/db/schema";
import { count, avg, inArray, sql } from "drizzle-orm";

// Only calculate financial metrics for orders that actually generated revenue
const validOrderStatuses = [
  "paid",
  "processing",
  "shipped",
  "delivered",
] as const;

export const getTotalProducts = async () => {
  try {
    const [result] = await db.select({ count: count() }).from(product);
    return result.count ?? 0;
  } catch (error) {
    console.error("Error fetching total products:", error);
    throw new Error("Failed to fetch total products");
  }
};

export const getTotalOrders = async () => {
  try {
    const [result] = await db
      .select({ count: count() })
      .from(order)
      .where(inArray(order.status, validOrderStatuses));
    return result.count ?? 0;
  } catch (error) {
    console.error("Error fetching total orders:", error);
    throw new Error("Failed to fetch total orders");
  }
};

export const getFinancialMetrics = async () => {
  try {
    const [result] = await db
      .select({
        averageTicket: avg(order.totalAmount).mapWith(Number),
        totalRevenue: sql<number>`sum(${order.totalAmount})`.mapWith(Number),
      })
      .from(order)
      .where(inArray(order.status, validOrderStatuses));

    return {
      averageTicket: Math.round(result?.averageTicket ?? 0),
      totalRevenue: Math.round(result?.totalRevenue ?? 0),
    };
  } catch (error) {
    console.error("Error fetching financial metrics:", error);
    throw new Error("Failed to fetch financial metrics");
  }
};
