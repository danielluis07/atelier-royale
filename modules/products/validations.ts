import { z } from "zod";
import { PAGINATION } from "@/constants";

export const productSortBySchema = z.enum([
  "createdAt",
  "updatedAt",
  "name",
  "price",
]);

export const publicProductSortBySchema = z.enum(["createdAt", "name", "price"]);

export const productSortOrderSchema = z.enum(["asc", "desc"]);

export const productsSearchParamsSchema = z.object({
  // Coerce string to number, but leave it optional if it fails/is missing
  page: z.coerce.number().int().min(1).optional(),
  // Strings stay strings
  search: z.string().optional(),
  categoryId: z.string().optional(),

  // Coerce "true"/"false" strings into actual booleans
  isAvailable: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),

  // Validate, but leave optional
  sortBy: productSortBySchema.optional(),
  sortOrder: productSortOrderSchema.optional(),
});

export const publicProductsSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  sortBy: publicProductSortBySchema.optional(),
  sortOrder: productSortOrderSchema.optional(),
});

export const variantInputSchema = z.object({
  sku: z.string(),
  name: z.string(),
  size: z.string().nullable().optional(),
  priceOverride: z
    .number()
    .int()
    .nonnegative("O preço da variação não pode ser negativo")
    .nullable()
    .optional(),
  stockQuantity: z
    .number()
    .int()
    .nonnegative("A quantidade em estoque não pode ser negativa")
    .default(0),
  weightGrams: z.number().int().nullable().optional(),
  heightCm: z.number().int().nullable().optional(),
  widthCm: z.number().int().nullable().optional(),
  lengthCm: z.number().int().nullable().optional(),
});

export const listProductsInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(PAGINATION.DEFAULT_PER_PAGE),
  search: z.string().optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().optional(),
  sortBy: productSortBySchema.default("createdAt"),
  sortOrder: productSortOrderSchema.default("desc"),
});

export const updateVariantInputSchema = variantInputSchema.extend({
  id: z.string().optional(),
});

const productBaseSchema = z.object({
  name: z.string().min(1, "O nome do produto é obrigatório"),
  description: z.string().min(1, "A descrição do produto é obrigatória"),
  brand: z.string().min(1, "A marca do produto é obrigatória"),
  imageUrl: z.string().optional(),
  basePrice: z
    .number()
    .int("O preço base deve ser um número inteiro")
    .nonnegative("O preço base não pode ser negativo"),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().nullable().optional(),
});

export const createProductInput = productBaseSchema.extend({
  variants: z.array(variantInputSchema).optional().default([]),
});

export const updateProductInput = productBaseSchema.extend({
  id: z.string().min(1, "O ID do produto é obrigatório"),
  variants: z.array(updateVariantInputSchema).optional(),
});

export const getProductInput = z.object({
  id: z.string().min(1, "ID do produto é obrigatório"),
});

export const listPublicProductsInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(PAGINATION.DEFAULT_PER_PAGE),
  search: z.string().optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().optional(),
  sortBy: publicProductSortBySchema.default("createdAt"),
  sortOrder: productSortOrderSchema.default("desc"),
});
