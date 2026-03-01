import { OrderDetails } from "@/components/admin/orders/order-details";
import { DetailsSkeleton } from "@/components/skeletons/admin/details-skeleton";
import { requireAdmin } from "@/lib/auth-utils";
import { db } from "@/db";
import { order, orderDelivery, orderItem, user } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const OrderDetailsContent = async ({ id }: { id: string }) => {
  const [orderData, items] = await Promise.all([
    db
      .select({
        id: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        userName: user.name,
        userEmail: user.email,
        status: order.status,
        subtotalAmount: order.subtotalAmount,
        shippingAmount: order.shippingAmount,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveryStatus: orderDelivery.status,
        trackingCode: orderDelivery.trackingCode,
        carrier: orderDelivery.carrier,
        recipientName: orderDelivery.recipientName,
        zipCode: orderDelivery.zipCode,
        street: orderDelivery.street,
        number: orderDelivery.number,
        complement: orderDelivery.complement,
        neighborhood: orderDelivery.neighborhood,
        city: orderDelivery.city,
        state: orderDelivery.state,
        dispatchedAt: orderDelivery.dispatchedAt,
        deliveredAt: orderDelivery.deliveredAt,
      })
      .from(order)
      .innerJoin(user, eq(order.userId, user.id))
      .leftJoin(orderDelivery, eq(order.id, orderDelivery.orderId))
      .where(eq(order.id, id))
      .then(([result]) => result ?? null),
    db
      .select({
        id: orderItem.id,
        productNameSnapshot: orderItem.productNameSnapshot,
        variantNameSnapshot: orderItem.variantNameSnapshot,
        skuSnapshot: orderItem.skuSnapshot,
        priceAtTime: orderItem.priceAtTime,
        quantity: orderItem.quantity,
      })
      .from(orderItem)
      .where(eq(orderItem.orderId, id))
      .orderBy(asc(orderItem.createdAt)),
  ]);

  if (!orderData) {
    notFound();
  }

  return <OrderDetails orderData={orderData} items={items} />;
};

const OrderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;

  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <OrderDetailsContent id={id} />
    </Suspense>
  );
};

export default OrderPage;
