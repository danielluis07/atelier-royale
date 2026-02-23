import { createTRPCRouter } from "@/trpc/init";
import { inferRouterOutputs } from "@trpc/server";
import { categoriesRouter } from "@/trpc/routers/categories";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
