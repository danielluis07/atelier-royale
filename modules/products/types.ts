import type { trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";
import type { z } from "zod";
import type { createProductFormInput } from "@/modules/products/validations";

export type ProductsInput = inferInput<typeof trpc.products.list>;
export type CreateProductInput = inferInput<typeof trpc.products.create>;
export type CreateProductFormValues = z.input<typeof createProductFormInput>;
