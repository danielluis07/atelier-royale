import { db } from "@/db";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/trpc/init";
import {
  order,
  orderDelivery,
  orderItem,
  payment,
  product,
  productVariant,
  user,
  userAddress,
} from "@/db/schema";
import {
  eq,
  desc,
  or,
  ilike,
  and,
  asc,
  count,
  inArray,
  gte,
  sql,
} from "drizzle-orm";
import { checkoutInput, listOrdersInput } from "@/modules/orders/validations";
import { TRPCError } from "@trpc/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";

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

  checkout: protectedProcedure
    .input(checkoutInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado.",
        });
      }

      try {
        const mergedItems = Array.from(
          input.items
            .reduce((map, item) => {
              const current = map.get(item.variantId) ?? 0;
              map.set(item.variantId, current + item.quantity);
              return map;
            }, new Map<string, number>())
            .entries(),
        ).map(([variantId, quantity]) => ({ variantId, quantity }));

        if (mergedItems.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "O pedido precisa ter ao menos um item.",
          });
        }

        const variantIds = mergedItems.map((i) => i.variantId);

        const dbVariants = await db
          .select({
            id: productVariant.id,
            sku: productVariant.sku,
            variantName: productVariant.name,
            priceOverride: productVariant.priceOverride,
            stockQuantity: productVariant.stockQuantity,
            productName: product.name,
            basePrice: product.basePrice,
          })
          .from(productVariant)
          .innerJoin(product, eq(productVariant.productId, product.id))
          .where(inArray(productVariant.id, variantIds));

        if (dbVariants.length !== mergedItems.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Um ou mais produtos não foram encontrados.",
          });
        }

        let subtotalAmount = 0;
        const itemsToInsert = mergedItems.map((item) => {
          const dbVariant = dbVariants.find((v) => v.id === item.variantId)!;

          if (dbVariant.stockQuantity < item.quantity) {
            throw new TRPCError({
              code: "CONFLICT",
              message: `Estoque insuficiente para ${dbVariant.productName}`,
            });
          }

          const priceAtTime = dbVariant.priceOverride ?? dbVariant.basePrice;
          subtotalAmount += priceAtTime * item.quantity;

          return {
            productVariantId: dbVariant.id,
            productNameSnapshot: dbVariant.productName,
            variantNameSnapshot: dbVariant.variantName,
            skuSnapshot: dbVariant.sku,
            priceAtTime,
            quantity: item.quantity,
          };
        });

        const totalAmount = subtotalAmount + input.shipping.amount;

        const [address] = await db
          .select()
          .from(userAddress)
          .where(eq(userAddress.id, input.addressId));

        if (!address || address.userId !== userId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Endereço inválido.",
          });
        }

        const newOrder = await db.transaction(async (tx) => {
          const [insertedOrder] = await tx
            .insert(order)
            .values({
              userId,
              subtotalAmount,
              shippingAmount: input.shipping.amount,
              totalAmount,
              status: "pending_payment",
            })
            .returning();

          for (const item of itemsToInsert) {
            const [updatedVariant] = await tx
              .update(productVariant)
              .set({
                stockQuantity: sql`${productVariant.stockQuantity} - ${item.quantity}`,
              })
              .where(
                and(
                  eq(productVariant.id, item.productVariantId),
                  gte(productVariant.stockQuantity, item.quantity),
                ),
              )
              .returning({ id: productVariant.id });

            if (!updatedVariant) {
              throw new TRPCError({
                code: "CONFLICT",
                message: `Estoque insuficiente para ${item.productNameSnapshot}`,
              });
            }
          }

          await tx.insert(orderItem).values(
            itemsToInsert.map((item) => ({
              ...item,
              orderId: insertedOrder.id,
            })),
          );

          await tx.insert(orderDelivery).values({
            orderId: insertedOrder.id,
            carrier: input.shipping.carrier,
            recipientName: address.recipientName,
            zipCode: address.zipCode,
            street: address.street,
            number: address.number,
            complement: address.complement,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
          });

          await tx.insert(payment).values({
            orderId: insertedOrder.id,
            amount: totalAmount,
            status: "pending",
          });

          return insertedOrder;
        });

        const preference = new Preference(mpClient);

        const mpResponse = await preference.create({
          body: {
            items: itemsToInsert.map((item) => ({
              id: item.skuSnapshot,
              title: `${item.productNameSnapshot} - ${item.variantNameSnapshot}`,
              quantity: item.quantity,
              unit_price: item.priceAtTime / 100,
            })),
            shipments: {
              cost: input.shipping.amount / 100,
            },
            external_reference: newOrder.id,
            back_urls: {
              success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
              failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
              pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
            },
            auto_return: "approved",
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
          },
        });

        if (!mpResponse.init_point) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha ao iniciar checkout no provedor de pagamento.",
          });
        }

        return {
          orderId: newOrder.id,
          checkoutUrl: mpResponse.init_point,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Erro no checkout:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao processar o checkout",
        });
      }
    }),
});
