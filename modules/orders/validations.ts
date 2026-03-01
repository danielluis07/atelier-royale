import { PAGINATION } from "@/constants";
import { z } from "zod";
import { orderStatusEnum, deliveryStatusEnum } from "@/db/schema";

export const orderSortBySchema = z.enum([
  "createdAt",
  "totalAmount",
  "orderNumber",
]);

export const orderStatusSchema = z.enum(orderStatusEnum.enumValues);

export const deliveryStatusSchema = z.enum(deliveryStatusEnum.enumValues);

export const orderSortOrderSchema = z.enum(["asc", "desc"]);

export const listOrdersInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(PAGINATION.DEFAULT_PER_PAGE),
  search: z.string().optional(),
  status: orderStatusSchema.optional(),
  deliveryStatus: deliveryStatusSchema.optional(),
  sortBy: orderSortBySchema.default("createdAt"),
  sortOrder: orderSortOrderSchema.default("desc"),
});

export const ordersSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
  status: orderStatusSchema.optional(),
  deliveryStatus: deliveryStatusSchema.optional(),
  sortBy: orderSortBySchema.optional(),
  sortOrder: orderSortOrderSchema.optional(),
});
