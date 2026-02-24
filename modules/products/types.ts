import type { RouterOutput } from "@/trpc/routers/_app";
import type { trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

export type ProductsInput = inferInput<typeof trpc.products.list>;
export type ProductsOutput = RouterOutput["products"]["list"];
export type ProductOutput = ProductsOutput["products"][number];
export type CreateProductInput = inferInput<typeof trpc.products.create>;
export type UpdateProductInput = inferInput<typeof trpc.products.update>;
