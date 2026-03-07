import type { RouterOutput } from "@/trpc/routers/_app";
import type { trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

export type ReviewsInput = inferInput<typeof trpc.reviews.list>;
export type ReviewsOutput = RouterOutput["reviews"]["list"];
export type ReviewOutput = ReviewsOutput["reviews"][number];

export type ReviewByProductInput = inferInput<typeof trpc.reviews.getByProduct>;
