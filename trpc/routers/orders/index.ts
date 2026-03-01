import { db } from "@/db";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { order, orderDelivery, user } from "@/db/schema";
import { eq, desc, or, ilike, and, asc, count } from "drizzle-orm";
import { listOrdersInput } from "@/modules/orders/validations";

export const ordersRouter = createTRPCRouter({
  list: adminProcedure.input(listOrdersInput).query(async ({ input }) => {
    const { page, perPage, search, status, deliveryStatus, sortBy, sortOrder } =
      input;
    const offset = (page - 1) * perPage;

    const conditions = [];

    if (search) {
      const normalizedSearch = search.trim();
      const escapedSearch = normalizedSearch.replace(/[%_]/g, "\\$&");
      const parsedOrderNumber = Number.parseInt(normalizedSearch, 10);

      conditions.push(
        or(
          ilike(user.name, `%${escapedSearch}%`),
          ilike(user.email, `%${escapedSearch}%`),
          ilike(order.id, `%${escapedSearch}%`),
          Number.isNaN(parsedOrderNumber)
            ? undefined
            : eq(order.orderNumber, parsedOrderNumber),
        ),
      );
    }

    if (status) {
      conditions.push(eq(order.status, status));
    }

    if (deliveryStatus) {
      conditions.push(eq(orderDelivery.status, deliveryStatus));
    }

    const whereClause = and(...conditions);

    const orderByColumn = {
      createdAt: order.createdAt,
      totalAmount: order.totalAmount,
      orderNumber: order.orderNumber,
    }[sortBy];

    const orderBy =
      sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    const [orders, total] = await Promise.all([
      db
        .select({
          id: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          name: user.name,
          email: user.email,
          status: order.status,
          deliveryStatus: orderDelivery.status,
          subtotalAmount: order.subtotalAmount,
          shippingAmount: order.shippingAmount,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        })
        .from(order)
        .innerJoin(user, eq(order.userId, user.id))
        .leftJoin(orderDelivery, eq(order.id, orderDelivery.orderId))
        .where(whereClause)
        .orderBy(orderBy)
        .limit(perPage)
        .offset(offset),
      db
        .select({ count: count() })
        .from(order)
        .innerJoin(user, eq(order.userId, user.id))
        .leftJoin(orderDelivery, eq(order.id, orderDelivery.orderId))
        .where(whereClause)
        .then(([result]) => result?.count ?? 0),
    ]);

    return {
      orders,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }),
});
