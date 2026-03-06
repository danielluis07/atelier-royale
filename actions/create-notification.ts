"use server";

import { db } from "@/db";
import { notification } from "@/db/schema";
import { realtime } from "@/lib/realtime";

export const createNotification = async ({
  payload,
}: {
  payload: {
    title: string;
    message: string;
    actionUrl: string;
    orderId: string;
  };
}) => {
  const { title, message, actionUrl, orderId } = payload;

  const [insertedNotification] = await db
    .insert(notification)
    .values({
      userId: process.env.ADMIN_ID!,
      title,
      message,
      actionUrl,
      resourceId: orderId,
    })
    .returning();

  try {
    await realtime.emit("notification.created", {
      id: insertedNotification.id,
      userId: insertedNotification.userId,
      type: insertedNotification.type,
      title: insertedNotification.title,
      message: insertedNotification.message,
      actionUrl: insertedNotification.actionUrl,
      resourceId: insertedNotification.resourceId,
      createdAt: insertedNotification.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to insert and emit notification:", error);
  }
};
