import {
  Clock,
  CircleCheck,
  Truck,
  CircleX,
  CreditCard,
  RotateCcw,
  PackageOpen,
  Package,
} from "lucide-react";
import type { ElementType } from "react";
import { ORDER_STATUS_LABELS, DELIVERY_STATUS_LABELS } from "@/constants";

const ORDER_STATUS_ICON: Record<string, ElementType> = {
  pending_payment: Clock,
  paid: CreditCard,
  processing: PackageOpen,
  shipped: Truck,
  delivered: CircleCheck,
  cancelled: CircleX,
  refunded: RotateCcw,
};

const ORDER_STATUS_COLOR: Record<string, string> = {
  pending_payment: "text-muted-foreground border-border",
  paid: "text-primary border-primary/30",
  processing: "text-primary border-primary/30",
  shipped: "text-primary border-primary/30",
  delivered: "text-green-700 border-green-700/30",
  cancelled: "text-destructive border-destructive/30",
  refunded: "text-muted-foreground border-border",
};

const ORDER_STATUS_BG: Record<string, string> = {
  pending_payment: "bg-muted/50",
  paid: "bg-primary/5",
  processing: "bg-primary/5",
  shipped: "bg-primary/5",
  delivered: "bg-green-50",
  cancelled: "bg-destructive/5",
  refunded: "bg-muted/50",
};

export const OrderStatusBanner = ({
  status,
  deliveryStatus,
  trackingCode,
}: {
  status: string;
  deliveryStatus?: string | null;
  trackingCode?: string | null;
}) => {
  const StatusIcon = ORDER_STATUS_ICON[status] ?? Package;
  const statusColor =
    ORDER_STATUS_COLOR[status] ?? "text-muted-foreground border-border";
  const statusBg = ORDER_STATUS_BG[status] ?? "bg-muted/50";

  return (
    <div
      className={`border ${statusColor.split(" ").slice(1).join(" ")} ${statusBg} p-6 sm:p-8 mb-10 flex items-center gap-5`}>
      <div
        className={`w-12 h-12 border ${statusColor.split(" ").slice(1).join(" ")} flex items-center justify-center shrink-0`}>
        <StatusIcon
          className={`w-5 h-5 ${statusColor.split(" ")[0]}`}
          strokeWidth={1.5}
        />
      </div>
      <div>
        <p className="font-serif text-lg text-foreground">
          {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ??
            status}
        </p>
        {deliveryStatus && (
          <p className="font-sans text-xs text-muted-foreground mt-0.5">
            Entrega:{" "}
            {DELIVERY_STATUS_LABELS[
              deliveryStatus as keyof typeof DELIVERY_STATUS_LABELS
            ] ?? deliveryStatus}
            {trackingCode ? ` · Rastreio: ${trackingCode}` : ""}
          </p>
        )}
      </div>
    </div>
  );
};
