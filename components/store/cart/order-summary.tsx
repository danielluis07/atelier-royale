"use client";

import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw, Lock } from "lucide-react";
import { centsToReais } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

export function OrderSummary({
  total,
  itemCount,
}: {
  total: number;
  itemCount: number;
}) {
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total;

  return (
    <div className="border border-border p-6 sm:p-8">
      <h2 className="font-serif text-lg text-foreground mb-6">
        Resumo do pedido
      </h2>

      {/* Subtotal */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})
          </span>
          <span className="font-sans text-sm text-foreground">
            {centsToReais(total)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-muted-foreground">Frete</span>
          <span className="font-sans text-sm text-muted-foreground">
            Calculado no checkout
          </span>
        </div>
      </div>

      {/* Free shipping progress */}
      {remainingForFreeShipping > 0 ? (
        <div className="mb-6">
          <div className="h-px w-full bg-border mb-4" />
          <p className="font-sans text-xs text-muted-foreground mb-2.5">
            Faltam{" "}
            <span className="text-primary font-medium">
              {centsToReais(remainingForFreeShipping)}
            </span>{" "}
            para frete grátis
          </p>
          <div className="h-1 w-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out"
              style={{
                width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="h-px w-full bg-border mb-4" />
          <p className="font-sans text-xs text-primary flex items-center gap-2">
            <Truck className="w-3.5 h-3.5" strokeWidth={1.5} />
            Você ganhou frete grátis!
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="h-px w-full bg-border mb-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-serif text-base text-foreground">Total</span>
        <span className="font-sans text-xl text-foreground tracking-wide">
          {centsToReais(total)}
        </span>
      </div>

      {/* Checkout */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-4 text-xs tracking-[0.25em] uppercase font-sans bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-500 mb-3">
        <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
        Finalizar compra
      </button>

      {/* Continue shopping */}
      <Link
        href="/products"
        className="w-full flex items-center justify-center py-3 text-xs tracking-[0.2em] uppercase font-sans text-foreground border border-border hover:border-foreground transition-colors duration-300">
        Continuar comprando
      </Link>

      {/* Trust badges */}
      <div className="mt-8 pt-6 border-t border-border space-y-3">
        {[
          { icon: ShieldCheck, text: "Compra 100% segura" },
          {
            icon: Truck,
            text: `Frete grátis acima de ${centsToReais(FREE_SHIPPING_THRESHOLD)}`,
          },
          { icon: RotateCcw, text: "Trocas e devoluções em até 30 dias" },
        ].map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.text}
              className="flex items-center gap-2.5 text-muted-foreground">
              <Icon
                className="w-3.5 h-3.5 text-primary shrink-0"
                strokeWidth={1.5}
              />
              <span className="font-sans text-[11px] tracking-wide">
                {badge.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
