"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/types/cart";
import { useCart } from "@/hooks/use-cart";
import { centsToReais } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-5 sm:gap-8 py-8 border-b border-border">
      {/* Image */}
      <Link
        href={`/products/${item.productSlug}`}
        className="relative w-28 h-36 sm:w-32 sm:h-40 shrink-0 overflow-hidden bg-muted">
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 112px, 128px"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Brand */}
        <span className="text-[10px] tracking-[0.4em] uppercase font-sans text-primary mb-1">
          {item.productBrand}
        </span>

        {/* Name */}
        <Link
          href={`/products/${item.productSlug}`}
          className="font-serif text-base sm:text-lg text-foreground leading-tight hover:text-primary transition-colors line-clamp-2 mb-1">
          {item.productName}
        </Link>

        {/* Variant info */}
        {(item.variantName || item.size) && (
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground mb-3">
            {item.size ? `Tamanho: ${item.size}` : item.variantName}
          </span>
        )}

        {/* Unit price */}
        <span className="font-sans text-xs text-muted-foreground mb-auto">
          {centsToReais(item.price)} un.
        </span>

        {/* Bottom row: quantity + remove + line total */}
        <div className="flex items-end justify-between mt-4 gap-4">
          <div className="flex items-center gap-4">
            {/* Quantity */}
            <div className="inline-flex items-center border border-border">
              <button
                type="button"
                onClick={() =>
                  updateQuantity(
                    item.productId,
                    item.variantId,
                    item.quantity - 1,
                  )
                }
                disabled={item.quantity <= 1}
                className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30"
                aria-label="Diminuir quantidade">
                <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <span className="w-10 h-9 flex items-center justify-center text-sm font-sans tracking-wide border-x border-border">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateQuantity(
                    item.productId,
                    item.variantId,
                    item.quantity + 1,
                  )
                }
                disabled={
                  item.maxStock !== null
                    ? item.quantity >= item.maxStock
                    : false
                }
                className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30"
                aria-label="Aumentar quantidade">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeItem(item.productId, item.variantId)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
              aria-label="Remover item">
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Line total */}
          <span className="font-sans text-base sm:text-lg text-foreground tracking-wide whitespace-nowrap">
            {centsToReais(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
