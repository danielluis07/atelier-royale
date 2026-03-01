"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { OrderOutput } from "@/modules/orders/types";
import { OrdersCellAction } from "@/components/admin/orders/cell-action";
import { Badge } from "@/components/ui/badge";
import { centsToReais } from "@/lib/utils";

const ORDER_STATUS_LABELS: Record<OrderOutput["status"], string> = {
  pending_payment: "Aguardando pagamento",
  paid: "Pago",
  processing: "Em preparação",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const DELIVERY_STATUS_LABELS = {
  processing: "Em separação",
  dispatched: "Despachado",
  in_transit: "Em trânsito",
  delivered: "Entregue",
  failed: "Falha na entrega",
};

const ORDER_STATUS_VARIANTS: Record<
  OrderOutput["status"],
  "default" | "secondary" | "destructive"
> = {
  pending_payment: "secondary",
  paid: "default",
  processing: "default",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
  refunded: "secondary",
};

const DELIVERY_STATUS_VARIANTS: Record<
  keyof typeof DELIVERY_STATUS_LABELS,
  "default" | "secondary" | "destructive"
> = {
  processing: "secondary",
  dispatched: "secondary",
  in_transit: "default",
  delivered: "default",
  failed: "destructive",
};

export const columns: ColumnDef<OrderOutput>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderNumber",
    header: "Pedido",
    cell: ({ row }) => {
      return <span className="font-semibold">#{row.original.orderNumber}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Cliente",
    cell: ({ row }) => {
      return (
        <div className="space-y-0.5">
          <p className="font-medium leading-none">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge variant={ORDER_STATUS_VARIANTS[status]}>
          {ORDER_STATUS_LABELS[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deliveryStatus",
    header: "Entrega",
    cell: ({ row }) => {
      const status = row.original.deliveryStatus;

      if (!status) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <Badge variant={DELIVERY_STATUS_VARIANTS[status]}>
          {DELIVERY_STATUS_LABELS[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      return <span>{centsToReais(row.original.totalAmount)}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return format(createdAt, "dd/MM/yyyy", { locale: ptBR });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <OrdersCellAction id={row.original.id} />,
  },
];
