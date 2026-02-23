import { createTRPCRouter } from "@/trpc/init";
import { inferRouterOutputs } from "@trpc/server";
import { categoriesRouter } from "@/trpc/routers/categories";
import { usersRouter } from "@/trpc/routers/users";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
