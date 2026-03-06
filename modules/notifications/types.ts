import type { RouterOutput } from "@/trpc/routers/_app";
import type { trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

export type NotificationsOutput = RouterOutput["notifications"]["list"];
export type NotificationOutput = NotificationsOutput[number];

export type NotificationsInput = inferInput<typeof trpc.notifications.list>;
