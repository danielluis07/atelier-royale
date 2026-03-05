"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { usePublicProductSuspense } from "@/modules/products/hooks";
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToReais } from "@/lib/utils";
import { RelatedProducts } from "@/components/store/product/related-products";
import { ProductVariants } from "./product-variants";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

export const ProductClient = ({ slug }: { slug: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { data } = usePublicProductSuspense(slug);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);

  const hasVariants = data.variants.length > 0;

  // Determine if variants represent sizes (have size field)
  const hasSizes = hasVariants && data.variants.some((v) => v.size);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    if (selectedVariantId) {
      return data.variants.find((v) => v.id === selectedVariantId) ?? null;
    }
    return null;
  }, [hasVariants, selectedVariantId, data.variants]);

  // Active price: variant priceOverride or basePrice
  const activePrice = selectedVariant?.priceOverride ?? data.basePrice;

  // Stock for the selected variant (or null if no variants)
  const activeStock = selectedVariant?.stockQuantity ?? null;

  const isOutOfStock =
    hasVariants && selectedVariant
      ? selectedVariant.stockQuantity === 0
      : false;

  const { addItem, items } = useCart();

  const isSelectedVariantInCart =
    hasVariants && !!selectedVariant
      ? items.some(
          (item) =>
            item.productId === data.id && item.variantId === selectedVariant.id,
        )
      : false;

  const canAdjustQuantity = hasVariants ? !!selectedVariant : true;

  const canAddToCart = hasVariants
    ? !!selectedVariant && !isOutOfStock && !isSelectedVariantInCart
    : true;

  const handleAddToCart = () => {
    if (isSelectedVariantInCart) {
      toast.error("Esta variacao ja esta na sacola.");
      return;
    }

    if (!canAddToCart) return;

    addItem({
      productId: data.id,
      productName: data.name,
      productBrand: data.brand ?? "",
      productImage: data.imageUrl,
      productSlug: slug,
      variantId: selectedVariant?.id ?? null,
      variantName: selectedVariant?.name ?? null,
      size: selectedVariant?.size ?? null,
      price: activePrice,
      quantity,
      maxStock: activeStock,
    });

    toast.success("Adicionado!");

    // Reset quantity after adding
    setQuantity(1);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Product Image */}
        <div className="relative aspect-square lg:aspect-3/4 overflow-hidden bg-muted">
          {isLoading && <Skeleton className="absolute inset-0" />}
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            priority
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col">
          {/* Brand */}
          <span className="text-[10px] tracking-[0.4em] uppercase font-sans text-primary mb-3">
            {data.brand}
          </span>

          {/* Name */}
          <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl tracking-tight text-foreground leading-[1.1] mb-4">
            {data.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-sans text-xl lg:text-2xl text-foreground tracking-wide">
              {centsToReais(activePrice)}
            </span>
            {selectedVariant?.priceOverride &&
              selectedVariant.priceOverride !== data.basePrice && (
                <span className="font-sans text-sm text-muted-foreground line-through">
                  {centsToReais(data.basePrice)}
                </span>
              )}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border mb-8" />

          {/* Variant / Size Selector */}
          {hasVariants && (
            <ProductVariants
              hasSizes={hasSizes}
              selectedVariantId={selectedVariantId}
              selectedVariant={selectedVariant}
              activeStock={activeStock}
              isOutOfStock={isOutOfStock}
              data={data}
              setSelectedVariantId={setSelectedVariantId}
              setQuantity={setQuantity}
            />
          )}

          {/* Quantity Selector */}
          <div className="mb-8">
            <span className="text-xs tracking-[0.2em] uppercase font-sans text-foreground mb-4 block">
              Quantidade
            </span>
            <div className="inline-flex items-center border border-border">
              <button
                type="button"
                onClick={() => {
                  if (!canAdjustQuantity) return;
                  setQuantity(Math.max(1, quantity - 1));
                }}
                disabled={!canAdjustQuantity || quantity <= 1}
                className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Diminuir quantidade">
                <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <span className="w-12 h-11 flex items-center justify-center text-sm font-sans tracking-wide border-x border-border">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!canAdjustQuantity) return;
                  const max = activeStock !== null ? activeStock : 99;
                  setQuantity(Math.min(max, quantity + 1));
                }}
                disabled={
                  !canAdjustQuantity ||
                  (activeStock !== null ? quantity >= activeStock : false)
                }
                className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Aumentar quantidade">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <p
              className={`text-[11px] mt-2 font-sans tracking-wide text-muted-foreground ${hasVariants && !selectedVariant ? "visible" : "invisible"}`}>
              Selecione uma variação para ajustar a quantidade.
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
            className={`
              group w-full flex items-center justify-center gap-3 py-4 text-xs tracking-[0.25em] uppercase font-sans transition-all duration-500 mb-4
              ${
                canAddToCart
                  ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }
            `}>
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
            {hasVariants && !selectedVariant
              ? "Selecione uma variação"
              : isOutOfStock
                ? "Produto esgotado"
                : isSelectedVariantInCart
                  ? "Variação já na sacola"
                  : "Adicionar à sacola"}
          </button>

          {/* Secondary Action */}
          <button
            type="button"
            className="w-full py-3.5 text-xs tracking-[0.2em] uppercase font-sans text-foreground border border-border hover:border-foreground transition-colors duration-300 mb-10">
            Adicionar à lista de desejos
          </button>

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-xs tracking-[0.2em] uppercase font-sans text-foreground mb-4">
              Descrição
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-[1.8]">
              {data.description}
            </p>
          </div>

          {/* Product Details (dimensions from variant) */}
          {selectedVariant &&
            (selectedVariant.weightGrams ||
              selectedVariant.heightCm ||
              selectedVariant.widthCm ||
              selectedVariant.lengthCm) && (
              <div className="mb-10">
                <h2 className="text-xs tracking-[0.2em] uppercase font-sans text-foreground mb-4">
                  Especificações
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {selectedVariant.weightGrams && (
                    <div className="flex items-center gap-2.5 text-sm font-sans text-muted-foreground">
                      <Package
                        className="w-4 h-4 text-primary shrink-0"
                        strokeWidth={1.5}
                      />
                      {selectedVariant.weightGrams}g
                    </div>
                  )}
                  {selectedVariant.heightCm && (
                    <div className="flex items-center gap-2.5 text-sm font-sans text-muted-foreground">
                      <span className="text-[10px] tracking-wider uppercase text-primary font-sans w-4 text-center shrink-0">
                        A
                      </span>
                      {selectedVariant.heightCm} cm
                    </div>
                  )}
                  {selectedVariant.widthCm && (
                    <div className="flex items-center gap-2.5 text-sm font-sans text-muted-foreground">
                      <span className="text-[10px] tracking-wider uppercase text-primary font-sans w-4 text-center shrink-0">
                        L
                      </span>
                      {selectedVariant.widthCm} cm
                    </div>
                  )}
                  {selectedVariant.lengthCm && (
                    <div className="flex items-center gap-2.5 text-sm font-sans text-muted-foreground">
                      <span className="text-[10px] tracking-wider uppercase text-primary font-sans w-4 text-center shrink-0">
                        C
                      </span>
                      {selectedVariant.lengthCm} cm
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Divider */}
          <div className="h-px w-full bg-border mb-8" />

          {/* Trust Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Truck,
                label: "Frete grátis",
                detail: `Acima de R$ ${centsToReais(FREE_SHIPPING_THRESHOLD)}`,
              },
              {
                icon: ShieldCheck,
                label: "Autenticidade",
                detail: "100% garantida",
              },
              {
                icon: RotateCcw,
                label: "Trocas",
                detail: "Em até 30 dias",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={1} />
                  </div>
                  <div>
                    <span className="text-[11px] tracking-wide uppercase font-sans text-foreground block leading-tight">
                      {feature.label}
                    </span>
                    <span className="text-[10px] font-sans text-muted-foreground">
                      {feature.detail}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <RelatedProducts productId={data.id} categoryId={data.categoryId} />
      </div>
    </>
  );
};
