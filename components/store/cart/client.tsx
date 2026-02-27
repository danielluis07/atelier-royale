"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { CartEmpty } from "@/components/store/cart/cart-empty";
import { CartItemCard } from "@/components/store/cart/item-card";
import { OrderSummary } from "@/components/store/cart/order-summary";

export const CartClient = () => {
  const { items, getTotal, getItemCount, clearCart } = useCart();

  const itemCount = getItemCount();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            Continuar comprando
          </Link>
          <h1 className="font-serif text-3xl lg:text-4xl tracking-tight text-foreground">
            Sua Sacola
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-destructive transition-colors self-start sm:self-auto">
          Limpar sacola
        </button>
      </div>

      {/* Grid: Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Column labels (desktop) */}
          <div className="hidden sm:flex items-center justify-between pb-4 border-b border-border mb-0">
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">
              Produto
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground">
              Total
            </span>
          </div>

          {items.map((item) => (
            <CartItemCard
              key={`${item.productId}-${item.variantId}`}
              item={item}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary total={total} itemCount={itemCount} />
        </div>
      </div>
    </div>
  );
};
