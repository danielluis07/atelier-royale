import { z } from "zod";

const variantInputSchema = z.object({
  sku: z.string().min(1, "SKU é obrigatório"), // For suits, for example, it is best for the admin to be able to set a custom SKU for each variant, instead of auto-generating one
  name: z.string().min(1, "O nome da variação é obrigatório"),
  size: z.string().nullable().optional(),
  priceOverride: z.number().int().nullable().optional(),
  stockQuantity: z.number().int().nonnegative().default(0),
  weightGrams: z.number().int().nullable().optional(),
  heightCm: z.number().int().nullable().optional(),
  widthCm: z.number().int().nullable().optional(),
  lengthCm: z.number().int().nullable().optional(),
});

export const createProductInput = z.object({
  name: z.string().min(1, "O nome do produto é obrigatório"),
  description: z.string().min(1, "A descrição do produto é obrigatória"),
  brand: z.string().min(1, "A marca do produto é obrigatória"),
  imageUrl: z.url("URL da imagem inválida"),
  basePrice: z
    .number()
    .int("O preço base deve ser um número inteiro")
    .nonnegative("O preço base não pode ser negativo"),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().nullable().optional(),
  variants: z.array(variantInputSchema).optional().default([]),
});

// Form-specific schema: imageUrl is handled separately (uploaded on submit)
export const createProductFormInput = createProductInput.omit({
  imageUrl: true,
});

export const updateVariantInputSchema = variantInputSchema.extend({
  id: z.string().optional(),
});

export const updateProductInput = z.object({
  id: z.string().min(1, "O ID do produto é obrigatório"),
  name: z.string().min(1, "O nome do produto é obrigatório"),
  description: z.string().min(1, "A descrição do produto é obrigatória"),
  brand: z.string().min(1, "A marca do produto é obrigatória"),
  imageUrl: z.url("URL da imagem inválida"),
  basePrice: z.number().int().nonnegative(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().nullable().optional(),
  variants: z.array(updateVariantInputSchema).optional(),
});
