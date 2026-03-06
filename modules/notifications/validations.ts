import { z } from "zod";
import { notificationTypeEnum } from "@/db/schema";

export const notificationTypeSchema = z.enum(notificationTypeEnum.enumValues);

export const baseNotificationsInput = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const markAsReadNotificationInput = z.object({
  id: z.string().min(1, "ID da notificação é obrigatório"),
});
