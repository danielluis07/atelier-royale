import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { normalizeUsersParams } from "@/modules/users/utils";
import type { UserInput, UsersInput } from "@/modules/users/types";

/**
 * Hook to fetch users.
 */
export const useUsersSuspense = (params: Partial<UsersInput>) => {
  const trpc = useTRPC();
  const normalized = normalizeUsersParams(params);

  return useSuspenseQuery(trpc.users.list.queryOptions(normalized));
};

/**
 * Hook to fetch a user.
 */
export const useUserSuspense = (params: UserInput) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.users.get.queryOptions(params));
};

/**
 * Hook to create a user profile.
 */
export const useCreateUserProfile = () => {
  const trpc = useTRPC();

  return useMutation(trpc.users.createProfile.mutationOptions());
};
