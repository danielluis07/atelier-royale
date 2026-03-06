import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { order, orderItem, payment, productVariant } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import type { MpWebhookBody } from "@/types/mercadopago";
import { realtime } from "@/lib/realtime";
// import { validateWebhookSignature } from "@/lib/webhook-utils";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-signature");
    const requestId = request.headers.get("x-request-id");

    const body: MpWebhookBody = await request.json();

    if (body.type === "payment" && body.data?.id) {
      const paymentId = String(body.data.id);

      if (!signature || !requestId) {
        console.warn("Webhook received without signature headers");
        return NextResponse.json(
          { error: "Headers de assinatura ausentes" },
          { status: 401 },
        );
      }

      // TODO: validate signature MP. For now, we'll skip this to avoid blocking development.
      /*       if (!validateWebhookSignature(signature, requestId, paymentId)) {
        console.warn("Webhook received with invalid signature");
        return NextResponse.json(
          { error: "Assinatura inválida" },
          { status: 401 },
        );
      } */

      const paymentClient = new Payment(mpClient);
      const paymentInfo = await paymentClient.get({ id: paymentId });

      const orderId = paymentInfo.external_reference;
      const orderNumber = paymentInfo.metadata?.orderNumber;
      const mpStatus = paymentInfo.status;

      if (!orderId) {
        console.warn(
          `Payment ${paymentId} has no associated external_reference`,
        );
        return NextResponse.json(
          { error: "Pagamento não tem external_reference associado" },
          { status: 400 },
        );
      }

      let mappedPaymentStatus: typeof payment.$inferInsert.status = "pending";
      let mappedOrderStatus: typeof order.$inferInsert.status =
        "pending_payment";
      let orderLabelStatus: string;

      switch (mpStatus) {
        case "approved":
          mappedPaymentStatus = "approved";
          mappedOrderStatus = "paid";
          orderLabelStatus = "aprovado";
          break;
        case "rejected":
          mappedPaymentStatus = "rejected";
          mappedOrderStatus = "cancelled";
          orderLabelStatus = "rejeitado";
          break;
        case "cancelled":
          mappedPaymentStatus = "cancelled";
          mappedOrderStatus = "cancelled";
          orderLabelStatus = "cancelado";
          break;
        case "refunded":
          mappedPaymentStatus = "refunded";
          mappedOrderStatus = "refunded";
          orderLabelStatus = "reembolsado";
          break;
        case "in_mediation":
          mappedPaymentStatus = "in_mediation";
          mappedOrderStatus = "pending_payment";
          orderLabelStatus = "em mediação";
          break;
        default:
          mappedPaymentStatus = "pending";
          mappedOrderStatus = "pending_payment";
          orderLabelStatus = "pendente";
      }

      await db.transaction(async (tx) => {
        const [currentOrder] = await tx
          .select()
          .from(order)
          .where(eq(order.id, String(orderId)));

        if (!currentOrder) {
          console.warn(`Webhook received for non-existent order: ${orderId}`);
          return;
        }

        await tx
          .update(payment)
          .set({
            status: mappedPaymentStatus,
            externalPaymentId: String(paymentInfo.id),
            paymentMethod: paymentInfo.payment_method_id,
          })
          .where(eq(payment.orderId, String(orderId)));

        if (mappedOrderStatus !== currentOrder.status) {
          await tx
            .update(order)
            .set({ status: mappedOrderStatus })
            .where(eq(order.id, String(orderId)));

          // repõe estoque apenas em transições específicas
          if (
            (currentOrder.status === "pending_payment" &&
              mappedOrderStatus === "cancelled") ||
            (currentOrder.status === "paid" && mappedOrderStatus === "refunded")
          ) {
            const items = await tx
              .select()
              .from(orderItem)
              .where(eq(orderItem.orderId, String(orderId)));

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

      await realtime.emit("notification.created", {
        orderId: orderId,
        message: `Pagamento ${orderLabelStatus} para pedido ${orderNumber || orderId}`,
        date: new Date().toISOString(),
      });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error while processing Mercado Pago webhook:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
