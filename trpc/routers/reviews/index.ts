import { z } from "zod";
import { db } from "@/db";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
  baseProcedure,
} from "@/trpc/init";
import { product, review, user } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import {
  eq,
  inArray,
  desc,
  and,
  or,
  ilike,
  asc,
  count,
  sql,
} from "drizzle-orm";
import { isDatabaseUniqueError } from "@/lib/db-utils";
import {
  createReviewInput,
  getReviewInput,
  listProductReviewsInput,
  listReviewsInput,
  setReviewApprovalInput,
} from "@/modules/reviews/validations";

export const reviewsRouter = createTRPCRouter({
  list: adminProcedure.input(listReviewsInput).query(async ({ input }) => {
    const {
      page,
      perPage,
      search,
      isApproved,
      userId: filterUserId,
      productId,
      rating,
      sortBy,
      sortOrder,
    } = input;

    const offset = (page - 1) * perPage;
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(review.comment, `%${search}%`),
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`),
          ilike(product.name, `%${search}%`),
        ),
      );
    }

    if (isApproved !== undefined) {
      conditions.push(eq(review.isApproved, isApproved));
    }

    if (rating !== undefined) {
      conditions.push(eq(review.rating, rating));
    }

    if (filterUserId) {
      conditions.push(eq(review.userId, filterUserId));
    }

    if (productId) {
      conditions.push(eq(review.productId, productId));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const orderByColumn = {
      createdAt: review.createdAt,
    }[sortBy];

    const orderBy =
      sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    const [reviews, totalResult] = await Promise.all([
      db
        .select({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          isApproved: review.isApproved,
          createdAt: review.createdAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.imageUrl,
          },
        })
        .from(review)
        .innerJoin(user, eq(review.userId, user.id))
        .innerJoin(product, eq(review.productId, product.id))
        .where(whereClause)
        .orderBy(orderBy)
        .limit(perPage)
        .offset(offset),

      db
        .select({ count: count() })
        .from(review)
        .innerJoin(user, eq(review.userId, user.id))
        .innerJoin(product, eq(review.productId, product.id))
        .where(whereClause)
        .then(([result]) => Number(result?.count ?? 0)),
    ]);

    return {
      reviews,
      pagination: {
        page,
        perPage,
        total: totalResult,
        totalPages: Math.ceil(totalResult / perPage),
      },
    };
  }),

  get: adminProcedure.input(getReviewInput).query(async ({ input }) => {
    try {
      const [reviewData] = await db
        .select({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          isApproved: review.isApproved,
          createdAt: review.createdAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.imageUrl,
          },
        })
        .from(review)
        .innerJoin(user, eq(review.userId, user.id))
        .innerJoin(product, eq(review.productId, product.id))
        .where(eq(review.id, input.id));

      if (!reviewData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review não encontrada",
        });
      }

      return reviewData;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Erro ao buscar review:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar review",
      });
    }
  }),

  getByProduct: baseProcedure
    .input(listProductReviewsInput)
    .query(async ({ input }) => {
      const { productId, page, perPage } = input;
      const offset = (page - 1) * perPage;

      try {
        const [existingProduct] = await db
          .select({
            id: product.id,
            name: product.name,
            slug: product.slug,
          })
          .from(product)
          .where(eq(product.id, productId));

        if (!existingProduct) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produto não encontrado",
          });
        }

        const whereClause = and(
          eq(review.productId, productId),
          eq(review.isApproved, true),
        );

        const [reviews, total, stats, ratingBreakdownRows] = await Promise.all([
          db
            .select({
              id: review.id,
              rating: review.rating,
              comment: review.comment,
              createdAt: review.createdAt,
              user: {
                id: user.id,
                name: user.name,
                image: user.image,
              },
            })
            .from(review)
            .innerJoin(user, eq(review.userId, user.id))
            .where(whereClause)
            .orderBy(desc(review.createdAt))
            .limit(perPage)
            .offset(offset),

          db
            .select({ count: count() })
            .from(review)
            .where(whereClause)
            .then(([result]) => Number(result?.count ?? 0)),

          db
            .select({
              averageRating: sql<number>`coalesce(avg(${review.rating}), 0)`,
              totalReviews: count(),
            })
            .from(review)
            .where(whereClause)
            .then(([result]) => ({
              averageRating: Number(result?.averageRating ?? 0),
              totalReviews: Number(result?.totalReviews ?? 0),
            })),

          db
            .select({
              rating: review.rating,
              count: count(),
            })
            .from(review)
            .where(whereClause)
            .groupBy(review.rating),
        ]);

        const ratingBreakdownMap = new Map(
          ratingBreakdownRows.map((row) => [row.rating, Number(row.count)]),
        );

        const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
          const total = ratingBreakdownMap.get(star) ?? 0;
          const percentage =
            stats.totalReviews > 0
              ? Number(((total / stats.totalReviews) * 100).toFixed(1))
              : 0;

          return {
            rating: star,
            count: total,
            percentage,
          };
        });

        return {
          product: existingProduct,
          reviews,
          summary: {
            averageRating: Number(stats.averageRating.toFixed(1)),
            totalReviews: stats.totalReviews,
            ratingBreakdown,
          },
          pagination: {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Erro ao buscar reviews do produto:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar reviews do produto",
        });
      }
    }),

  setApproval: adminProcedure
    .input(setReviewApprovalInput)
    .mutation(async ({ input }) => {
      try {
        const [existingReview] = await db
          .select({ id: review.id, isApproved: review.isApproved })
          .from(review)
          .where(eq(review.id, input.id));

        if (!existingReview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Review não encontrada",
          });
        }

        const [updatedReview] = await db
          .update(review)
          .set({
            isApproved: input.isApproved,
          })
          .where(eq(review.id, input.id))
          .returning();

        return updatedReview;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Erro ao atualizar aprovação da review:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar aprovação da review",
        });
      }
    }),

  create: protectedProcedure
    .input(createReviewInput)
    .mutation(async ({ input, ctx }) => {
      const { auth } = ctx;

      const userId = auth.user.id;

      try {
        const [existingProduct] = await db
          .select({ id: product.id })
          .from(product)
          .where(eq(product.id, input.productId));

        if (!existingProduct) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produto não encontrado",
          });
        }

        const sanitizedComment = input.comment?.trim() || null;

        const [createdReview] = await db
          .insert(review)
          .values({
            userId,
            productId: input.productId,
            rating: input.rating,
            comment: sanitizedComment,
            isApproved: false,
          })
          .returning();

        return createdReview;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (isDatabaseUniqueError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Você já avaliou este produto",
          });
        }

        console.error("Erro ao criar review:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar a criação da review",
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
          message: "Nenhum ID de review fornecido",
        });
      }

      try {
        const deletedRows = await db
          .delete(review)
          .where(inArray(review.id, input.ids))
          .returning();

        if (deletedRows.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reviews não encontradas",
          });
        }

        return deletedRows;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Erro ao deletar reviews:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro interno ao tentar deletar as reviews",
        });
      }
    }),
});
