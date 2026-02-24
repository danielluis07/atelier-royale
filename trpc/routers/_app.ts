import { createTRPCRouter } from "@/trpc/init";
import { inferRouterOutputs } from "@trpc/server";
import { categoriesRouter } from "@/trpc/routers/categories";
import { usersRouter } from "@/trpc/routers/users";
import { productsRouter } from "@/trpc/routers/products";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  categories: categoriesRouter,
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
