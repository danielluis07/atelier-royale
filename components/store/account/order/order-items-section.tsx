import { Package } from "lucide-react";
import { centsToReais } from "@/lib/utils";

const OrderItemsSection = ({
  items,
  subtotalAmount,
  shippingAmount,
  totalAmount,
}: {
  items: {
    id: string;
    productNameSnapshot: string;
    variantNameSnapshot: string;
    skuSnapshot: string;
    priceAtTime: number;
    quantity: number;
  }[];
  subtotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
}) => {
  return (
    <div className="border border-border">
      <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-border bg-muted/30">
        <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-serif text-base text-foreground">
            Itens do pedido
          </h2>
          <p className="font-sans text-xs text-muted-foreground tracking-wide">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-5 px-6 sm:px-8 py-5">
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-foreground mb-0.5">
                {item.productNameSnapshot}
              </p>
              <p className="font-sans text-xs text-muted-foreground">
                {item.variantNameSnapshot} · SKU {item.skuSnapshot}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-sans text-sm font-medium text-foreground">
                {centsToReais(item.priceAtTime * item.quantity)}
              </p>
              <p className="font-sans text-xs text-muted-foreground">
                {item.quantity}x {centsToReais(item.priceAtTime)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-muted/20 px-6 sm:px-8 py-5 space-y-2">
        <div className="flex justify-between font-sans text-xs text-muted-foreground">
          <span>Subtotal</span>
          <span>{centsToReais(subtotalAmount)}</span>
        </div>
        <div className="flex justify-between font-sans text-xs text-muted-foreground">
          <span>Frete</span>
          <span>
            {shippingAmount === 0 ? "Grátis" : centsToReais(shippingAmount)}
          </span>
        </div>
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between font-sans text-sm font-medium text-foreground">
          <span>Total</span>
          <span>{centsToReais(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsSection;
