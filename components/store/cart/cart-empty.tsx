"use client";

import { Link, ShoppingBag } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-20 h-20 border border-border flex items-center justify-center mb-8">
        <ShoppingBag
          className="w-8 h-8 text-muted-foreground/40"
          strokeWidth={1}
        />
      </div>
      <h2 className="font-serif text-2xl text-foreground mb-3">
        Sua sacola está vazia
      </h2>
      <p className="font-sans text-sm text-muted-foreground max-w-80 mb-10">
        Descubra peças cuidadosamente selecionadas para compor o guarda-roupa
        ideal
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-3 py-3.5 px-10 text-xs tracking-[0.25em] uppercase font-sans bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-500">
        Explorar coleção
      </Link>
    </div>
  );
}
