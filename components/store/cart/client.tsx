"use client";

import { useCart } from "@/hooks/use-cart";
import { CartEmpty } from "@/components/store/cart/cart-empty";
import { CartItemCard } from "@/components/store/cart/item-card";
import { OrderSummary } from "@/components/store/cart/order-summary";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { CartClientSkeleton } from "@/components/skeletons/store/cart-client-skeleton";

export const CartClient = ({ addressId }: { addressId?: string }) => {
  const { items, getTotal, getItemCount } = useCart();
  const isMounted = useHasMounted();

  if (!isMounted) {
    return <CartClientSkeleton />;
  }

  const itemCount = getItemCount();
  const total = getTotal();

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
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
        <OrderSummary
          total={total}
          itemCount={itemCount}
          addressId={addressId}
        />
      </div>
    </div>
  );
};
