"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ReviewOutput } from "@/modules/reviews/types";
import { ReviewsCellAction } from "@/components/admin/reviews/cell-action";

function StarsRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-500 text-sm">
        {"★".repeat(rating)}
        <span className="text-muted-foreground">{"★".repeat(5 - rating)}</span>
      </span>
      <span className="text-sm text-muted-foreground">({rating}/5)</span>
    </div>
  );
}

export const columns: ColumnDef<ReviewOutput>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "rating",
    header: "Avaliação",
    cell: ({ row }) => <StarsRating rating={row.original.rating} />,
  },
  {
    id: "product",
    header: "Produto",
    cell: ({ row }) => {
      const product = row.original.product;

      return (
        <Link
          href={`/products/${product.id}`}
          className="font-medium hover:underline">
          {product.name}
        </Link>
      );
    },
  },
  {
    id: "user",
    header: "Usuário",
    cell: ({ row }) => {
      const user = row.original.user;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Comentário",
    cell: ({ row }) => {
      const comment = row.original.comment;

      if (!comment) {
        return (
          <span className="text-sm text-muted-foreground">Sem comentário</span>
        );
      }

      return (
        <div className="max-w-[320px] truncate text-sm" title={comment}>
          {comment}
        </div>
      );
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
    accessorKey: "isApproved",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.isApproved;

      return status ? (
        <Badge className="bg-green-600 hover:bg-green-600">Aprovado</Badge>
      ) : (
        <Badge variant="destructive">Reprovado</Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <ReviewsCellAction
        id={row.original.id}
        isApproved={row.original.isApproved}
      />
    ),
  },
];
