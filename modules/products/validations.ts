import { z } from "zod";

export const variantInputSchema = z.object({
  sku: z.string().optional(),
  name: z.string().optional(),
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
