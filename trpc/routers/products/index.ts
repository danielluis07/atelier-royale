import { z } from "zod";
import { db } from "@/db";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { product, productVariant } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, inArray, desc, and, notInArray, ne } from "drizzle-orm";
import { isDatabaseUniqueError, slugify } from "@/lib/utils";
import {
  createProductInput,
  updateProductInput,
} from "@/modules/products/validations";

export const productsRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    const data = await db
      .select({
        id: product.id,
        name: product.name,
        description: product.description,
        brand: product.brand,
        imageUrl: product.imageUrl,
        basePrice: product.basePrice,
        isAvailable: product.isAvailable,
        categoryId: product.categoryId,
      })
      .from(product)
      .orderBy(desc(product.createdAt));

    return data;
  }),

  create: adminProcedure
    .input(createProductInput)
    .mutation(async ({ input }) => {
      try {
        const newProduct = await db.transaction(async (tx) => {
          // --- 1. Create the product ---
          const [createdProduct] = await tx
            .insert(product)
            .values({
              name: input.name,
              description: input.description,
              brand: input.brand,
              imageUrl: input.imageUrl,
              basePrice: input.basePrice,
              isAvailable: input.isAvailable ?? true,
              categoryId: input.categoryId,
              slug: slugify(input.name),
            })
            .returning();

          if (!createdProduct) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Erro ao criar produto",
            });
          }

          // --- 2. Handle Variants ---
          if (input.variants.length === 0) {
            // Example: Suits and Shirts (No variants sent by Admin, create a default one)
            const fallbackSku = `SKU-${createdProduct.id.slice(-12).toUpperCase()}`;

            await tx.insert(productVariant).values({
              productId: createdProduct.id,
              sku: fallbackSku,
              name: "Tamanho Único",
              size: null,
              priceOverride: null,
              stockQuantity: 0,
              weightGrams: null,
              heightCm: null,
              widthCm: null,
              lengthCm: null,
            });
          } else {
            // Example: Suits and Shirts (Admin sent variants, create them all)
            const variantsToInsert = input.variants.map((v) => ({
              productId: createdProduct.id,
              sku: v.sku,
              name: v.name,
              size: v.size ?? null,
              priceOverride: v.priceOverride ?? null,
              stockQuantity: v.stockQuantity,
              weightGrams: v.weightGrams ?? null,
              heightCm: v.heightCm ?? null,
              widthCm: v.widthCm ?? null,
              lengthCm: v.lengthCm ?? null,
            }));

            await tx.insert(productVariant).values(variantsToInsert);
          }

          return createdProduct;
        });

        return newProduct;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (isDatabaseUniqueError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Já existe um produto com este nome ou SKU",
          });
        }

        console.error("Erro ao criar produto:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar a requisição",
        });
      }
    }),

  update: adminProcedure
    .input(updateProductInput)
    .mutation(async ({ input }) => {
      try {
        // 1. Generate the slug and pre-validate to avoid database conflict errors
        const generatedSlug = slugify(input.name);

        const [existingProductWithSlug] = await db
          .select({ id: product.id })
          .from(product)
          .where(
            and(
              eq(product.slug, generatedSlug),
              ne(product.id, input.id), // Ignore the product we are currently updating
            ),
          )
          .limit(1);

        if (existingProductWithSlug) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Já existe outro produto com um nome similar. Por favor, escolha um nome diferente.",
          });
        }

        // 2. Start the database transaction
        const updatedProduct = await db.transaction(async (tx) => {
          // 2.1 Update the main product record
          const [productUpdated] = await tx
            .update(product)
            .set({
              name: input.name,
              slug: generatedSlug, // Use the slug we generated above
              description: input.description,
              brand: input.brand,
              imageUrl: input.imageUrl,
              basePrice: input.basePrice,
              isAvailable: input.isAvailable ?? true,
              categoryId: input.categoryId,
            })
            .where(eq(product.id, input.id))
            .returning();

          if (!productUpdated) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Produto não encontrado",
            });
          }

          if (input.variants) {
            const variantsToKeepIds = input.variants
              .filter((v) => v.id !== undefined)
              .map((v) => v.id as string);

            // 2.2. Delete the variants that were removed by the Admin
            if (variantsToKeepIds.length > 0) {
              await tx
                .delete(productVariant)
                .where(
                  and(
                    eq(productVariant.productId, input.id),
                    notInArray(productVariant.id, variantsToKeepIds),
                  ),
                );
            } else {
              // If an empty variants array is sent, it means all variants were removed, so we delete all existing variants for this product
              await tx
                .delete(productVariant)
                .where(eq(productVariant.productId, input.id));
            }

            // 2.3. Separate variants into insert and update arrays
            const variantsToInsert = [];
            const variantsToUpdate = [];

            for (const variant of input.variants) {
              if (variant.id) {
                variantsToUpdate.push(variant);
              } else {
                variantsToInsert.push(variant);
              }
            }

            // 2.4. Bulk Insert new variants (Single database query)
            if (variantsToInsert.length > 0) {
              await tx.insert(productVariant).values(
                variantsToInsert.map((variant) => ({
                  productId: input.id,
                  sku: variant.sku,
                  name: variant.name,
                  size: variant.size ?? null,
                  priceOverride: variant.priceOverride ?? null,
                  stockQuantity: variant.stockQuantity,
                  weightGrams: variant.weightGrams ?? null,
                  heightCm: variant.heightCm ?? null,
                  widthCm: variant.widthCm ?? null,
                  lengthCm: variant.lengthCm ?? null,
                })),
              );
            }

            // 2.5. Concurrently Update existing variants
            if (variantsToUpdate.length > 0) {
              await Promise.all(
                variantsToUpdate.map((variant) =>
                  tx
                    .update(productVariant)
                    .set({
                      sku: variant.sku,
                      name: variant.name,
                      size: variant.size ?? null,
                      priceOverride: variant.priceOverride ?? null,
                      stockQuantity: variant.stockQuantity,
                      weightGrams: variant.weightGrams ?? null,
                      heightCm: variant.heightCm ?? null,
                      widthCm: variant.widthCm ?? null,
                      lengthCm: variant.lengthCm ?? null,
                    })
                    .where(
                      and(
                        eq(productVariant.id, variant.id!),
                        eq(productVariant.productId, input.id),
                      ),
                    ),
                ),
              );
            }
          }

          return productUpdated;
        });

        return updatedProduct;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        // This still acts as a good fallback for other constraints, like variant SKUs
        if (isDatabaseUniqueError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Já existe uma variante com este SKU",
          });
        }

        console.error("Erro ao atualizar produto:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar produto",
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
          message: "Nenhum id de produto fornecido",
        });
      }

      try {
        const deletedRows = await db
          .delete(product)
          .where(inArray(product.id, input.ids))
          .returning();

        if (deletedRows.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produtos não encontrados",
          });
        }

        return deletedRows;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (error instanceof Error && error.message.includes("foreign key")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Não é possível deletar produtos com itens associados",
          });
        }

        console.error("Erro ao deletar produtos:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro interno ao tentar deletar os produtos",
        });
      }
    }),
});
