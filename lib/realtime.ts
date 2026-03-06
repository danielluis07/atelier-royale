import { InferRealtimeEvents, Realtime } from "@upstash/realtime";
import { z } from "zod/v4";
import { redis } from "@/lib/redis";
import { notificationTypeSchema } from "@/modules/notifications/validations";

const schema = {
  notification: {
    created: z.object({
      id: z.string(),
      userId: z.string(),
      type: notificationTypeSchema,
      title: z.string(),
      message: z.string(),
      actionUrl: z.string().nullable().optional(),
      resourceId: z.string().nullable().optional(),
      createdAt: z.string(),
    }),
  },
};

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
