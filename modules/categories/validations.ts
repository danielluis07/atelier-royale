import { z } from "zod";

export const createCategoryInput = z.object({
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  imageUrl: z.string().min(1, "A URL da imagem é obrigatória"),
  slug: z.string().optional(),
});

export const updateCategoryInput = z.object({
  id: z.string().min(1, "ID da categoria é obrigatório"),
  name: z.string().min(1, "O nome da categoria é obrigatório"),
  slug: z.string().optional(),
});
