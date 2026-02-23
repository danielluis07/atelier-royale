import { prefetch, trpc } from "@/trpc/server";
import type { UsersInput } from "@/modules/users/types";
import { normalizeUsersParams } from "@/modules/users/utils";

/**
 * Prefetch users
 */
export const prefetchUsers = async (params: Partial<UsersInput>) => {
  return prefetch(trpc.users.list.queryOptions(normalizeUsersParams(params)));
};
