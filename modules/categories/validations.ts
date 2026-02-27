import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  description: z
    .string()
    .max(200, "Máximo de 200 caracteres")
    .nullable()
    .optional(),
});

export const createCategoryInput = createCategorySchema.extend({
  imageUrl: z.string().min(1, "A URL da imagem é obrigatória"),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1, "ID da categoria é obrigatório"),
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  description: z
    .string()
    .max(200, "Máximo de 200 caracteres")
    .nullable()
    .optional(),
});

export const updateCategoryInput = updateCategorySchema.extend({
  imageUrl: z.string().min(1, "A URL da imagem é obrigatória"),
});
