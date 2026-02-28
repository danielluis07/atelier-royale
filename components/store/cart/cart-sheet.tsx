"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { centsToReais } from "@/lib/utils";
import type { CartItem } from "@/types/cart";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-5 border-b border-border last:border-b-0">
      {/* Image */}
      <Link
        href={`/products/${item.productSlug}`}
        className="relative w-20 h-24 shrink-0 overflow-hidden bg-muted">
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="80px"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0">
        <Link
          href={`/products/${item.productSlug}`}
          className="font-serif text-sm text-foreground leading-tight hover:text-primary transition-colors line-clamp-1">
          {item.productName}
        </Link>

        {item.productBrand && (
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-primary mt-1">
            {item.productBrand}
          </span>
        )}

        {(item.variantName || item.size) && (
          <span className="text-[10px] tracking-[0.15em] uppercase font-sans text-muted-foreground mt-1">
            {item.size ? `Tam. ${item.size}` : item.variantName}
          </span>
        )}

        <span className="font-sans text-sm text-foreground mt-auto pt-2">
          {centsToReais(item.price * item.quantity)}
        </span>

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between mt-2">
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
              className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30"
              aria-label="Diminuir quantidade">
              <Minus className="w-3 h-3" strokeWidth={1.5} />
            </button>
            <span className="w-8 h-7 flex items-center justify-center text-xs font-sans tracking-wide border-x border-border">
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
                item.maxStock !== null ? item.quantity >= item.maxStock : false
              }
              className="w-7 h-7 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30"
              aria-label="Aumentar quantidade">
              <Plus className="w-3 h-3" strokeWidth={1.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.productId, item.variantId)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
            aria-label="Remover item">
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const { items, getTotal, getItemCount } = useCart();
  const isMounted = useHasMounted();

  const itemCount = isMounted ? getItemCount() : 0;
  const total = isMounted ? getTotal() : 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        aria-label="Carrinho de compras"
        className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative">
        <ShoppingBag className="size-4.5" strokeWidth={1.5} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[9px] flex items-center justify-center rounded-full">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>
      <SheetContent className="flex flex-col p-0 sm:max-w-md">
        <SheetHeader className="px-6 pt-6 pb-0">
          <SheetTitle className="font-serif text-xl tracking-wide">
            Sua Sacola
            {itemCount > 0 && (
              <span className="text-sm font-sans text-muted-foreground ml-2 tracking-normal">
                ({itemCount} {itemCount === 1 ? "item" : "itens"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6">
          <ScrollArea className="h-full pr-1.5">
            {!isMounted || items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <ShoppingBag
                  className="w-12 h-12 text-muted-foreground/40 mb-6"
                  strokeWidth={1}
                />
                <p className="font-serif text-lg text-foreground mb-2">
                  Sua sacola está vazia
                </p>
                <p className="font-sans text-sm text-muted-foreground max-w-56">
                  Explore nossa coleção e descubra peças exclusivas
                </p>
                <SheetClose asChild>
                  <Link
                    href="/products"
                    className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-primary hover:text-foreground transition-colors">
                    Explorar coleção
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </SheetClose>
              </div>
            ) : (
              <div className="divide-y-0">
                {items.map((item) => (
                  <CartItemRow
                    key={`${item.productId}-${item.variantId}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer */}
        {isMounted && items.length > 0 && (
          <SheetFooter className="border-t border-border px-6 py-5 gap-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs tracking-[0.2em] uppercase font-sans text-muted-foreground">
                Subtotal
              </span>
              <span className="font-sans text-lg text-foreground tracking-wide">
                {centsToReais(total)}
              </span>
            </div>

            <p className="text-[10px] font-sans text-muted-foreground tracking-wide">
              Frete e impostos calculados no checkout
            </p>

            {/* Checkout Button */}
            <SheetClose asChild>
              <Link
                href="/cart"
                className="w-full flex items-center justify-center gap-3 py-3.5 text-xs tracking-[0.25em] uppercase font-sans bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-500">
                <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                Ver sacola completa
              </Link>
            </SheetClose>

            {/* Continue Shopping */}
            <SheetClose asChild>
              <Link
                href="/products"
                className="w-full flex items-center justify-center py-3 text-xs tracking-[0.2em] uppercase font-sans text-foreground border border-border hover:border-foreground transition-colors duration-300">
                Continuar comprando
              </Link>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
