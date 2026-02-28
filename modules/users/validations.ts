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

const emptyToUndefined = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v));

export const userProfileFormSchema = z.object({
  document: emptyToUndefined.optional(), // you can add .min(11) if you want
  phone: emptyToUndefined.optional(),
  birthDate: emptyToUndefined
    .optional()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Data inválida"),
  address: z.object({
    label: emptyToUndefined.optional(),
    recipientName: z.string().trim().min(1),
    zipCode: z.string().trim().min(8), // masked form "00000-000" is length 9
    street: z.string().trim().min(1),
    number: z.string().trim().min(1),
    complement: emptyToUndefined.optional(),
    neighborhood: z.string().trim().min(1),
    city: z.string().trim().min(1),
    state: z.enum([
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
    ]),
    isDefault: z.boolean().default(true),
  }),
});
