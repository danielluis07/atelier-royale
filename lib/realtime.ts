import { InferRealtimeEvents, Realtime } from "@upstash/realtime";
import { z } from "zod/v4";
import { redis } from "@/lib/redis";

const schema = {
  notification: {
    created: z.object({
      orderId: z.string().optional(),
      message: z.string(),
      date: z.string(),
    }),
  },
};

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
