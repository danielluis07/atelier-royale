import type { RouterOutput } from "@/trpc/routers/_app";

export type CategoriesOutput = RouterOutput["categories"]["list"];
export type CategoryOutput = CategoriesOutput[number];
