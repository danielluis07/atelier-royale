import { db } from "@/db";
import { order, orderDelivery, orderItem, payment } from "@/db/schema";
import { and, asc, eq, desc, count, min } from "drizzle-orm";

export const getOrder = async (orderId: string, userId: string) => {
  const [orderData] = await db
    .select()
    .from(order)
    .where(and(eq(order.id, orderId), eq(order.userId, userId)));

  return orderData;
};

export const getOrderItems = async (orderId: string) => {
  const items = await db
    .select()
    .from(orderItem)
    .where(eq(orderItem.orderId, orderId))
    .orderBy(asc(orderItem.createdAt), asc(orderItem.id));

  return items;
};

export const getOrderDelivery = async (orderId: string) => {
  const [delivery] = await db
    .select()
    .from(orderDelivery)
    .where(eq(orderDelivery.orderId, orderId));

  return delivery;
};

export const getOrderPayments = async (orderId: string) => {
  const payments = await db
    .select()
    .from(payment)
    .where(eq(payment.orderId, orderId))
    .orderBy(desc(payment.createdAt));

  return payments;
};

export const getOrders = async (userId: string) => {
  const latestDelivery = db
    .selectDistinctOn([orderDelivery.orderId], {
      orderId: orderDelivery.orderId,
      status: orderDelivery.status,
    })
    .from(orderDelivery)
    .orderBy(orderDelivery.orderId, desc(orderDelivery.createdAt))
    .as("latestDelivery");

  const orders = await db
    .select({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status,
      itemCount: count(orderItem.id),
      firstItemName: min(orderItem.productNameSnapshot),
      deliveryStatus: latestDelivery.status,
    })
    .from(order)
    .innerJoin(orderItem, eq(order.id, orderItem.orderId))
    .leftJoin(latestDelivery, eq(order.id, latestDelivery.orderId))
    .where(eq(order.userId, userId))
    .groupBy(order.id, latestDelivery.status)
    .orderBy(desc(order.createdAt));

  return orders;
};
