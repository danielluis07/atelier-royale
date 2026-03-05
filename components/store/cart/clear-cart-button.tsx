"use client";

import { useCart } from "@/hooks/use-cart";

export const ClearCartButton = () => {
  const { clearCart } = useCart();
  return (
    <button
      type="button"
      onClick={clearCart}
      className="text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-destructive transition-colors self-start sm:self-auto">
      Limpar sacola
    </button>
  );
};
