import { z } from "zod";
import { PAGINATION } from "@/constants";

export const reviewSortBySchema = z.enum(["createdAt"]);

export const reviewSortOrderSchema = z.enum(["asc", "desc"]);

export const listReviewsInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(PAGINATION.DEFAULT_PER_PAGE),
  search: z.string().trim().optional(),
  isApproved: z.boolean().optional(),
  userId: z.string().optional(),
  productId: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  sortBy: reviewSortBySchema.default("createdAt"),
  sortOrder: reviewSortOrderSchema.default("desc"),
});

export const createReviewInput = z.object({
  productId: z.string().min(1, "ID do produto é obrigatório"),
  rating: z
    .number()
    .int("A nota deve ser um número inteiro.")
    .min(1, "A nota deve ser pelo menos 1 estrela.")
    .max(5, "A nota não pode exceder 5 estrelas."),
  comment: z
    .string()
    .trim()
    .max(1000, "Comentário da review não pode exceder 1000 caracteres.")
    .optional(),
});

export const setReviewApprovalInput = z.object({
  id: z.string().min(1, "ID da review é obrigatório"),
  isApproved: z.boolean(),
});

export const reviewsSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
  userId: z.string().optional(),
  productId: z.string().optional(),
  isApproved: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sortBy: reviewSortBySchema.optional(),
  sortOrder: reviewSortOrderSchema.optional(),
});

export const listProductReviewsInput = z.object({
  productId: z.string().min(1, "Product ID is required"),
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(50).default(10),
});

export const getReviewInput = z.object({
  id: z.string().min(1, "ID do review é obrigatório"),
});
