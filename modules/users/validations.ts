import { z } from "zod";
import { PAGINATION } from "@/constants";

export const userSortBySchema = z.enum(["createdAt", "updatedAt", "name"]);
export const userSortOrderSchema = z.enum(["asc", "desc"]);

export const listUsersInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(PAGINATION.DEFAULT_PER_PAGE),
  search: z.string().optional(),
  banned: z.boolean().optional(),
  sortBy: userSortBySchema.default("createdAt"),
  sortOrder: userSortOrderSchema.default("desc"),
});

export const getUserInput = z.object({
  id: z.string().min(1, "ID do usuário é obrigatório"),
});

export const usersSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
  banned: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  sortBy: userSortBySchema.optional(),
  sortOrder: userSortOrderSchema.optional(),
});
