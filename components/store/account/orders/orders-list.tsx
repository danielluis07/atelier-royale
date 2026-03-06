import {
  Package,
  ChevronRight,
  Clock,
  CircleCheck,
  Truck,
  CircleX,
  CreditCard,
  RotateCcw,
  PackageOpen,
} from "lucide-react";
import Link from "next/link";
import { ORDER_STATUS_LABELS, DELIVERY_STATUS_LABELS } from "@/constants";
import { format } from "date-fns";
import { centsToReais } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { db } from "@/db";
import { order, orderItem, orderDelivery } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getOrders } from "@/modules/account/actions";

const ORDER_STATUS_ICON: Record<string, React.ElementType> = {
  pending_payment: Clock,
  paid: CreditCard,
  processing: PackageOpen,
  shipped: Truck,
  delivered: CircleCheck,
  cancelled: CircleX,
  refunded: RotateCcw,
};

const ORDER_STATUS_COLOR: Record<string, string> = {
  pending_payment: "text-muted-foreground",
  paid: "text-primary",
  processing: "text-primary",
  shipped: "text-primary",
  delivered: "text-green-700",
  cancelled: "text-destructive",
  refunded: "text-muted-foreground",
};

export const OrdersList = async ({ userId }: { userId: string }) => {
  const orders = await getOrders(userId);

  return (
    <>
      {orders.length === 0 ? (
        <div className="border border-border py-20 text-center">
          <div className="w-14 h-14 mx-auto mb-6 border border-border flex items-center justify-center">
            <Package
              className="w-6 h-6 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <p className="font-serif text-lg text-foreground mb-2">
            Nenhum pedido ainda
          </p>
          <p className="font-sans text-sm text-muted-foreground mb-8">
            Quando você fizer sua primeira compra, ela aparecerá aqui.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-sans text-primary hover:text-foreground transition-colors">
            Explorar produtos
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-0 border border-border divide-y divide-border">
          {orders.map((o) => {
            const StatusIcon = ORDER_STATUS_ICON[o.status] ?? Package;
            const statusColor =
              ORDER_STATUS_COLOR[o.status] ?? "text-muted-foreground";

            const itemLabel =
              o.itemCount === 1
                ? o.firstItemName
                : `${o.firstItemName} e mais ${o.itemCount - 1} ${o.itemCount - 1 === 1 ? "item" : "itens"}`;
            return (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="group flex items-center gap-5 p-5 sm:p-6 hover:bg-muted/50 transition-colors duration-300">
                {/* Status icon */}
                <div className="w-11 h-11 border border-border flex items-center justify-center shrink-0 group-hover:border-primary transition-colors duration-300">
                  <StatusIcon
                    className={`w-5 h-5 ${statusColor} group-hover:text-primary transition-colors duration-300`}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-sans text-sm font-medium text-foreground">
                      Pedido #{o.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] tracking-widest uppercase font-sans ${statusColor}`}>
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-muted-foreground truncate">
                    {itemLabel}
                  </p>

                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="font-sans text-xs text-muted-foreground">
                      {format(o.createdAt, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                    <span className="font-sans text-xs font-medium text-foreground">
                      {centsToReais(o.totalAmount)}
                    </span>
                    {o.deliveryStatus && (
                      <span className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground">
                        {DELIVERY_STATUS_LABELS[o.deliveryStatus]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <ChevronRight
                  className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
                  strokeWidth={1.5}
                />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};
