import type { UsersInput } from "@/modules/users/types";
import { PAGINATION } from "@/constants";

export const normalizeUsersParams = (
  params: Partial<UsersInput>,
): UsersInput => ({
  page: params.page ?? PAGINATION.DEFAULT_PAGE,
  perPage: params.perPage ?? PAGINATION.DEFAULT_PER_PAGE,
  search: params.search || undefined,
  banned: params.banned ?? undefined,
  sortBy: params.sortBy ?? "createdAt",
  sortOrder: params.sortOrder ?? "desc",
});
