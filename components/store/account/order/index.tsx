import { OrderPageHeader } from "@/components/store/account/order/order-page-header";
import { OrderStatusBanner } from "@/components/store/account/order/order-status-banner";
import { OrderStatusTimeline } from "@/components/store/account/order/order-status-timeline";
import { OrderItemsSection } from "@/components/store/account/order/order-items-section";
import { OrderPaymentSection } from "@/components/store/account/order/order-payment-section";
import { OrderDeliverySection } from "@/components/store/account/order/order-delivery-section";
import { OrderSummaryCard } from "@/components/store/account/order/order-summary-card";
import { db } from "@/db";
import { order, orderDelivery, orderItem, payment } from "@/db/schema";
import { and, eq, desc, asc } from "drizzle-orm";
import { notFound } from "next/navigation";

export const OrderMain = async ({
  orderId,
  userId,
}: {
  orderId: string;
  userId: string;
}) => {
  // Fetch order ensuring it belongs to the user
  const [orderData] = await db
    .select()
    .from(order)
    .where(and(eq(order.id, orderId), eq(order.userId, userId)))
    .limit(1);

  if (!orderData) {
    notFound();
  }

  // Fetch items, delivery, and payment in parallel
  const [items, delivery, payments] = await Promise.all([
    db
      .select()
      .from(orderItem)
      .where(eq(orderItem.orderId, orderData.id))
      .orderBy(asc(orderItem.createdAt), asc(orderItem.id)),
    db
      .select()
      .from(orderDelivery)
      .where(eq(orderDelivery.orderId, orderData.id))
      .then((res) => res[0] ?? null),
    db
      .select()
      .from(payment)
      .where(eq(payment.orderId, orderData.id))
      .orderBy(desc(payment.createdAt)),
  ]);

  const latestPayment = payments[0] ?? null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
      <OrderPageHeader
        orderNumber={orderData.orderNumber}
        createdAt={orderData.createdAt}
      />

      <OrderStatusBanner
        status={orderData.status}
        deliveryStatus={delivery?.status}
        trackingCode={delivery?.trackingCode}
      />

      <OrderStatusTimeline status={orderData.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        <div className="lg:col-span-2 space-y-10">
          <OrderItemsSection
            items={items}
            subtotalAmount={orderData.subtotalAmount}
            shippingAmount={orderData.shippingAmount}
            totalAmount={orderData.totalAmount}
          />

          <OrderPaymentSection payment={latestPayment} />
        </div>

        <div className="lg:col-span-1 space-y-10">
          <OrderDeliverySection delivery={delivery} />

          <OrderSummaryCard
            orderNumber={orderData.orderNumber}
            createdAt={orderData.createdAt}
            updatedAt={orderData.updatedAt}
            totalAmount={orderData.totalAmount}
          />
        </div>
      </div>
    </div>
  );
};
