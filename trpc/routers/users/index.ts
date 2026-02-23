import { db } from "@/db";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { user } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, desc, or, ilike, and, asc, count } from "drizzle-orm";
import { getUserInput, listUsersInput } from "@/modules/users/validations";

export const usersRouter = createTRPCRouter({
  list: adminProcedure.input(listUsersInput).query(async ({ input }) => {
    const { page, perPage, search, banned, sortBy, sortOrder } = input;
    const offset = (page - 1) * perPage;

    const conditions = [];
    conditions.push(eq(user.role, "user"));

    if (search) {
      conditions.push(
        or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)),
      );
    }

    if (banned !== undefined) {
      conditions.push(eq(user.banned, banned));
    }

    const whereClause = and(...conditions);

    const orderByColumn = {
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
    }[sortBy];

    const orderBy =
      sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    const [posts, total] = await Promise.all([
      db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          banned: user.banned,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(perPage)
        .offset(offset),
      db
        .select({ count: count() })
        .from(user)
        .where(whereClause)
        .then(([result]) => result?.count ?? 0),
    ]);

    return {
      posts,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }),

  get: adminProcedure.input(getUserInput).query(async ({ input }) => {
    const { id } = input;

    const [userData] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, id));

    if (!userData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Usuário não encontrado",
      });
    }

    return userData;
  }),
});
