import type { RouterOutput } from "@/trpc/routers/_app";
import type { trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

export type OrdersInput = inferInput<typeof trpc.orders.list>;
export type OrdersOutput = RouterOutput["orders"]["list"];
export type OrderOutput = OrdersOutput["orders"][number];

export type CheckoutInput = inferInput<typeof trpc.orders.checkout>;
export type CheckoutOutput = RouterOutput["orders"]["checkout"];
