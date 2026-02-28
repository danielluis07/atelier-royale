import { db } from "@/db";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { user, userAddress, userProfile } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, desc, or, ilike, and, asc, count } from "drizzle-orm";
import {
  getUserInput,
  listUsersInput,
  userProfileFormSchema,
} from "@/modules/users/validations";
import { isDatabaseUniqueError } from "@/lib/db-utils";

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

    const [users, total] = await Promise.all([
      db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          banned: user.banned,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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
      users,
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

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId));

    const [defaultAddress] = await db
      .select()
      .from(userAddress)
      .where(
        and(eq(userAddress.userId, userId), eq(userAddress.isDefault, true)),
      );

    return { profile: profile ?? null, address: defaultAddress ?? null };
  }),

  createProfile: protectedProcedure
    .input(userProfileFormSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const profileInsert = {
        userId,
        document: input.document ?? null,
        phone: input.phone ?? null,
        birthDate: input.birthDate ?? null,
      };

      const addressInsert = {
        userId,
        label: input.address.label ?? null,
        recipientName: input.address.recipientName,
        zipCode: input.address.zipCode,
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement ?? null,
        neighborhood: input.address.neighborhood,
        city: input.address.city,
        state: input.address.state,
        isDefault: input.address.isDefault ?? false,
      };

      try {
        const result = await db.transaction(async (tx) => {
          // Optional: prevent multiple default addresses for the same user
          if (addressInsert.isDefault) {
            await tx
              .update(userAddress)
              .set({ isDefault: false })
              .where(eq(userAddress.userId, userId));
          }

          // Insert profile (will fail if profile already exists due to unique userId)
          const [createdProfile] = await tx
            .insert(userProfile)
            .values(profileInsert)
            .returning({
              id: userProfile.id,
              userId: userProfile.userId,
              document: userProfile.document,
              phone: userProfile.phone,
              birthDate: userProfile.birthDate,
              createdAt: userProfile.createdAt,
              updatedAt: userProfile.updatedAt,
            });

          // Insert address
          const [createdAddress] = await tx
            .insert(userAddress)
            .values(addressInsert)
            .returning({
              id: userAddress.id,
              userId: userAddress.userId,
              label: userAddress.label,
              recipientName: userAddress.recipientName,
              zipCode: userAddress.zipCode,
              street: userAddress.street,
              number: userAddress.number,
              complement: userAddress.complement,
              neighborhood: userAddress.neighborhood,
              city: userAddress.city,
              state: userAddress.state,
              isDefault: userAddress.isDefault,
              createdAt: userAddress.createdAt,
              updatedAt: userAddress.updatedAt,
            });

          return { profile: createdProfile, address: createdAddress };
        });

        return result;
      } catch (err) {
        // Unique constraint violations: document already used, or profile already exists for user
        if (isDatabaseUniqueError(err)) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Conflito de dados: documento já cadastrado ou perfil já existe para este usuário.",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar perfil",
          cause: err,
        });
      }
    }),

  upsertProfile: protectedProcedure
    .input(userProfileFormSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      try {
        return await db.transaction(async (tx) => {
          if (input.address.isDefault) {
            await tx
              .update(userAddress)
              .set({ isDefault: false })
              .where(eq(userAddress.userId, userId));
          }

          // UPSERT profile by unique userId
          const [profile] = await tx
            .insert(userProfile)
            .values({
              userId,
              document: input.document ?? null,
              phone: input.phone ?? null,
              birthDate: input.birthDate ?? null,
            })
            .onConflictDoUpdate({
              target: userProfile.userId,
              set: {
                document: input.document ?? null,
                phone: input.phone ?? null,
                birthDate: input.birthDate ?? null,
                updatedAt: new Date(),
              },
            })
            .returning();

          // Find default address to update (or create one)
          const [existingDefault] = await tx
            .select({ id: userAddress.id })
            .from(userAddress)
            .where(
              and(
                eq(userAddress.userId, userId),
                eq(userAddress.isDefault, true),
              ),
            );

          let address;
          if (existingDefault) {
            [address] = await tx
              .update(userAddress)
              .set({
                label: input.address.label ?? null,
                recipientName: input.address.recipientName,
                zipCode: input.address.zipCode,
                street: input.address.street,
                number: input.address.number,
                complement: input.address.complement ?? null,
                neighborhood: input.address.neighborhood,
                city: input.address.city,
                state: input.address.state,
                isDefault: input.address.isDefault ?? true,
                updatedAt: new Date(),
              })
              .where(eq(userAddress.id, existingDefault.id))
              .returning();
          } else {
            [address] = await tx
              .insert(userAddress)
              .values({
                userId,
                label: input.address.label ?? null,
                recipientName: input.address.recipientName,
                zipCode: input.address.zipCode,
                street: input.address.street,
                number: input.address.number,
                complement: input.address.complement ?? null,
                neighborhood: input.address.neighborhood,
                city: input.address.city,
                state: input.address.state,
                isDefault: input.address.isDefault ?? true,
              })
              .returning();
          }

          return { profile, address };
        });
      } catch (err) {
        if (isDatabaseUniqueError(err)) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Conflito de dados: documento já cadastrado ou perfil já existe para este usuário.",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao salvar perfil.",
          cause: err,
        });
      }
    }),
});
