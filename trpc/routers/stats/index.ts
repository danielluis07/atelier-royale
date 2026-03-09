import { z } from "zod";
import { and, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { order } from "@/db/schema";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { TIME_ZONE } from "@/constants";
import {
  addDays,
  calculateDeltaPercent,
  getLocalDateString,
} from "@/lib/chart-utils";

const revenueOrderStatuses = [
  "paid",
  "processing",
  "shipped",
  "delivered",
] as const;

export const statsRouter = createTRPCRouter({
  getSalesEvolution: adminProcedure
    .input(
      z.object({
        rangeDays: z.union([z.literal(7), z.literal(30), z.literal(90)]),
      }),
    )
    .query(async ({ input }) => {
      const rangeDays = input.rangeDays;

      const today = getLocalDateString(new Date(), TIME_ZONE);
      const currentStartDate = addDays(today, -(rangeDays - 1));
      const previousStartDate = addDays(currentStartDate, -rangeDays);
      const previousEndDate = addDays(currentStartDate, -1);

      const ordersWithLocalDate = db
        .select({
          localDate: sql<string>`
            timezone(${TIME_ZONE}, ${order.createdAt})::date::text
          `.as("local_date"),
          status: order.status,
          totalAmount: order.totalAmount,
        })
        .from(order)
        .as("orders_with_local_date");

      const rows = await db
        .select({
          date: ordersWithLocalDate.localDate,
          revenue: sql<number>`
            COALESCE(SUM(${ordersWithLocalDate.totalAmount}), 0)
          `.mapWith(Number),
          orders: sql<number>`COUNT(*)`.mapWith(Number),
        })
        .from(ordersWithLocalDate)
        .where(
          and(
            inArray(ordersWithLocalDate.status, revenueOrderStatuses),
            sql`${ordersWithLocalDate.localDate}::date >= ${previousStartDate}::date`,
            sql`${ordersWithLocalDate.localDate}::date <= ${today}::date`,
          ),
        )
        .groupBy(ordersWithLocalDate.localDate)
        .orderBy(ordersWithLocalDate.localDate);

      const metricsByDate = new Map(
        rows.map((row) => [
          row.date,
          {
            revenue: row.revenue,
            orders: row.orders,
          },
        ]),
      );

      const series = Array.from({ length: rangeDays }, (_, index) => {
        const date = addDays(currentStartDate, index);
        const previousDate = addDays(date, -rangeDays);

        const current = metricsByDate.get(date) ?? {
          revenue: 0,
          orders: 0,
        };

        const previous = metricsByDate.get(previousDate) ?? {
          revenue: 0,
          orders: 0,
        };

        const averageTicket =
          current.orders > 0 ? Math.round(current.revenue / current.orders) : 0;

        const previousAverageTicket =
          previous.orders > 0
            ? Math.round(previous.revenue / previous.orders)
            : 0;

        return {
          date,
          previousDate,
          revenue: current.revenue,
          previousRevenue: previous.revenue,
          orders: current.orders,
          previousOrders: previous.orders,
          averageTicket,
          previousAverageTicket,
        };
      });

      const currentRevenue = series.reduce(
        (acc, item) => acc + item.revenue,
        0,
      );
      const previousRevenue = series.reduce(
        (acc, item) => acc + item.previousRevenue,
        0,
      );

      const currentOrders = series.reduce((acc, item) => acc + item.orders, 0);
      const previousOrders = series.reduce(
        (acc, item) => acc + item.previousOrders,
        0,
      );

      const currentAverageTicket =
        currentOrders > 0 ? Math.round(currentRevenue / currentOrders) : 0;

      const previousAverageTicket =
        previousOrders > 0 ? Math.round(previousRevenue / previousOrders) : 0;

      return {
        period: {
          rangeDays,
          currentStartDate,
          currentEndDate: today,
          previousStartDate,
          previousEndDate,
        },
        summary: {
          revenue: {
            current: currentRevenue,
            previous: previousRevenue,
            deltaPercent: calculateDeltaPercent(
              currentRevenue,
              previousRevenue,
            ),
          },
          orders: {
            current: currentOrders,
            previous: previousOrders,
            deltaPercent: calculateDeltaPercent(currentOrders, previousOrders),
          },
          averageTicket: {
            current: currentAverageTicket,
            previous: previousAverageTicket,
            deltaPercent: calculateDeltaPercent(
              currentAverageTicket,
              previousAverageTicket,
            ),
          },
        },
        series,
      };
    }),
});
