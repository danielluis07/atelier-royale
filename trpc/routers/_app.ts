import { createTRPCRouter } from "@/trpc/init";
import { inferRouterOutputs } from "@trpc/server";
import { categoriesRouter } from "@/trpc/routers/categories";
import { usersRouter } from "@/trpc/routers/users";
import { productsRouter } from "@/trpc/routers/products";
import { ordersRouter } from "@/trpc/routers/orders";
import { statsRouter } from "@/trpc/routers/stats";
import { notificationsRouter } from "@/trpc/routers/notifications";
import { reviewsRouter } from "@/trpc/routers/reviews";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  categories: categoriesRouter,
  products: productsRouter,
  orders: ordersRouter,
  stats: statsRouter,
  notifications: notificationsRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
