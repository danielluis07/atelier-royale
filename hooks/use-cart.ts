import type { CartState } from "@/types/cart";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existing = items.find(
          (i) =>
            i.productId === item.productId && i.variantId === item.variantId,
        );

        if (existing) {
          const newQty = existing.quantity + (item.quantity ?? 1);
          const maxQty = existing.maxStock ? existing.maxStock : 99;
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: Math.min(newQty, maxQty) }
                : i,
            ),
          });
        } else {
          const initialQty = item.quantity ?? 1;
          const maxQty = item.maxStock ?? 99;
          set({
            items: [
              ...items,
              { ...item, quantity: Math.min(initialQty, maxQty) },
            ],
          });
        }
      },

      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId),
          ),
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.maxStock ?? 99) }
              : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "atelier-royale-cart",
    },
  ),
);
