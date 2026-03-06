import { z } from "zod";
import { db } from "@/db";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { notification } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, inArray, desc, and, count } from "drizzle-orm";
import {
  baseNotificationsInput,
  markAsReadNotificationInput,
} from "@/modules/notifications/validations";

export const notificationsRouter = createTRPCRouter({
  list: adminProcedure
    .input(baseNotificationsInput)
    .query(async ({ input }) => {
      const { userId } = input;

      const data = await db
        .select({
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          actionUrl: notification.actionUrl,
          createdAt: notification.createdAt,
        })
        .from(notification)
        .where(eq(notification.userId, userId))
        .orderBy(desc(notification.createdAt));

      return data;
    }),

  getUnreadCount: adminProcedure
    .input(baseNotificationsInput)
    .query(async ({ input }) => {
      const [result] = await db
        .select({ count: count() })
        .from(notification)
        .where(
          and(
            eq(notification.userId, input.userId),
            eq(notification.isRead, false),
          ),
        );

      return result?.count ?? 0;
    }),

  markAsRead: adminProcedure
    .input(markAsReadNotificationInput)
    .mutation(async ({ input }) => {
      const updatedRow = await db
        .update(notification)
        .set({ isRead: true })
        .where(eq(notification.id, input.id))
        .returning();

      if (!updatedRow.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notificação não encontrada",
        });
      }

      return updatedRow[0];
    }),

  markAllAsRead: adminProcedure
    .input(baseNotificationsInput)
    .mutation(async ({ input }) => {
      await db
        .update(notification)
        .set({ isRead: true })
        .where(
          and(
            eq(notification.userId, input.userId),
            eq(notification.isRead, false),
          ),
        );

      return { success: true };
    }),

  deleteMany: adminProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      if (!input.ids.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nenhum id de notificação fornecido",
        });
      }

      try {
        const deletedRows = await db
          .delete(notification)
          .where(inArray(notification.id, input.ids))
          .returning();

        if (deletedRows.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Notificações não encontradas",
          });
        }

        return deletedRows;
      } catch (error) {
        console.error("Erro ao deletar notificações:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro interno ao tentar deletar as notificações",
        });
      }
    }),
});
