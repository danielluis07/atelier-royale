import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { order, orderItem, payment, productVariant } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import type { MpWebhookBody } from "@/types/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body: MpWebhookBody = await request.json();

    if (body.type === "payment" && body.data?.id) {
      const paymentId = body.data.id;

      const paymentClient = new Payment(mpClient);
      const paymentInfo = await paymentClient.get({ id: paymentId });

      const orderId = paymentInfo.external_reference;
      const mpStatus = paymentInfo.status;

      if (!orderId) {
        return NextResponse.json(
          { error: "Pagamento não tem external_reference associado" },
          { status: 400 },
        );
      }

      let mappedPaymentStatus: typeof payment.$inferInsert.status = "pending";
      let mappedOrderStatus: typeof order.$inferInsert.status =
        "pending_payment";

      switch (mpStatus) {
        case "approved":
          mappedPaymentStatus = "approved";
          mappedOrderStatus = "paid";
          break;
        case "rejected":
          mappedPaymentStatus = "rejected";
          mappedOrderStatus = "cancelled";
          break;
        case "cancelled":
          mappedPaymentStatus = "cancelled";
          mappedOrderStatus = "cancelled";
          break;
        case "refunded":
          mappedPaymentStatus = "refunded";
          mappedOrderStatus = "refunded";
          break;
        case "in_mediation":
          mappedPaymentStatus = "in_mediation";
          mappedOrderStatus = "pending_payment";
          break;
        default:
          mappedPaymentStatus = "pending";
          mappedOrderStatus = "pending_payment";
      }

      await db.transaction(async (tx) => {
        const [currentOrder] = await tx
          .select()
          .from(order)
          .where(eq(order.id, orderId));

        if (!currentOrder) return;

        await tx
          .update(payment)
          .set({
            status: mappedPaymentStatus,
            externalPaymentId: String(paymentInfo.id),
            paymentMethod: paymentInfo.payment_method_id,
          })
          .where(eq(payment.orderId, orderId));

        if (mappedOrderStatus !== currentOrder.status) {
          await tx
            .update(order)
            .set({
              status: mappedOrderStatus,
            })
            .where(eq(order.id, orderId));

          if (
            currentOrder.status === "pending_payment" &&
            mappedOrderStatus === "cancelled"
          ) {
            const items = await tx
              .select()
              .from(orderItem)
              .where(eq(orderItem.orderId, orderId));
            for (const item of items) {
              if (item.productVariantId) {
                await tx
                  .update(productVariant)
                  .set({
                    stockQuantity: sql`${productVariant.stockQuantity} + ${item.quantity}`,
                  })
                  .where(eq(productVariant.id, item.productVariantId));
              }
            }
          }
        }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro no processamento do webhook do Mercado Pago:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
