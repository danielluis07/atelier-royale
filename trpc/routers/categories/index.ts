import { z } from "zod";
import { db } from "@/db";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { category } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, inArray, desc } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import {
  isDatabaseForeignKeyError,
  isDatabaseUniqueError,
} from "@/lib/db-utils";
import {
  createCategoryInput,
  updateCategoryInput,
} from "@/modules/categories/validations";

export const categoriesRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    const data = await db
      .select({
        id: category.id,
        name: category.name,
      })
      .from(category)
      .orderBy(desc(category.createdAt));

    return data;
  }),

  create: adminProcedure
    .input(createCategoryInput)
    .mutation(async ({ input }) => {
      try {
        const [newCategory] = await db
          .insert(category)
          .values({
            ...input,
            slug: slugify(input.name),
          })
          .returning();

        return newCategory;
      } catch (error) {
        if (isDatabaseUniqueError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Já existe uma categoria com este nome",
          });
        }

        console.error("Erro ao criar categoria:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar categoria",
        });
      }
    }),

  update: adminProcedure
    .input(updateCategoryInput)
    .mutation(async ({ input }) => {
      try {
        const [updatedCategory] = await db
          .update(category)
          .set({
            name: input.name,
            slug: slugify(input.name),
          })
          .where(eq(category.id, input.id))
          .returning();

        if (!updatedCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Categoria não encontrada",
          });
        }

        return updatedCategory;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (isDatabaseUniqueError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Já existe uma categoria com este nome",
          });
        }

        console.error("Erro ao atualizar categoria:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar a categoria",
        });
      }
    }),

  deleteMany: adminProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      if (!input.ids.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Nenhum id de categoria fornecido",
        });
      }

      try {
        const deletedRows = await db
          .delete(category)
          .where(inArray(category.id, input.ids))
          .returning();

        if (deletedRows.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Categorias não encontradas",
          });
        }

        return deletedRows;
      } catch (error) {
        if (isDatabaseForeignKeyError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Não é possível deletar categoria(s) que possuem produtos vinculados",
          });
        }

        console.error("Erro ao deletar categorias:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro interno ao tentar deletar as categorias",
        });
      }
    }),
});
