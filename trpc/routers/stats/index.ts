import { db } from "@/db";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { order, product, productVariant } from "@/db/schema";
import { and, eq, gte, inArray, sql } from "drizzle-orm";

const revenueOrderStatuses = [
  "paid",
  "processing",
  "shipped",
  "delivered",
] as const;

const DAY_RANGE = 30;

export const statsRouter = createTRPCRouter({
  getProfitByPeriod: adminProcedure.query(async () => {
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - (DAY_RANGE - 1));

    const profitRows = await db
      .select({
        date: sql<string>`DATE(${order.createdAt})`,
        profit: sql<number>`COALESCE(SUM(${order.totalAmount}), 0)`.mapWith(
          Number,
        ),
      })
      .from(order)
      .where(
        and(
          inArray(order.status, revenueOrderStatuses),
          gte(order.createdAt, startDate),
        ),
      )
      .groupBy(sql`DATE(${order.createdAt})`);

    const profitsByDate = new Map(
      profitRows.map((row) => [row.date, row.profit]),
    );

    return Array.from({ length: DAY_RANGE }, (_, index) => {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + index);

      const dateKey = date.toISOString().slice(0, 10);

      return {
        date: dateKey,
        profit: profitsByDate.get(dateKey) ?? 0,
      };
    });
  }),

  getProductsByStatus: adminProcedure.query(async () => {
    const products = await db
      .select({
        isAvailable: product.isAvailable,
        totalStock:
          sql<number>`COALESCE(SUM(${productVariant.stockQuantity}), 0)`.mapWith(
            Number,
          ),
      })
      .from(product)
      .leftJoin(productVariant, eq(product.id, productVariant.productId))
      .groupBy(product.id, product.isAvailable);

    const byStatus = products.reduce(
      (acc, item) => {
        if (!item.isAvailable) {
          acc.unavailable += 1;
          return acc;
        }

        if (item.totalStock > 0) {
          acc.available += 1;
          return acc;
        }

        acc.outOfStock += 1;
        return acc;
      },
      {
        available: 0,
        outOfStock: 0,
        unavailable: 0,
      },
    );

    return [
      { key: "available", status: "Disponível", total: byStatus.available },
      { key: "outOfStock", status: "Sem estoque", total: byStatus.outOfStock },
      {
        key: "unavailable",
        status: "Indisponível",
        total: byStatus.unavailable,
      },
    ];
  }),
});
