import type { RouterOutput } from "@/trpc/routers/_app";
import type { trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

export type UsersInput = inferInput<typeof trpc.users.list>;
export type UsersOutput = RouterOutput["users"]["list"];
export type UserOutput = UsersOutput["posts"][number];
export type UserInput = inferInput<typeof trpc.users.get>;
