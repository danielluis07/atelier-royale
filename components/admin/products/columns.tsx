"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { ProductOutput } from "@/modules/products/types";
import { ProductsCellAction } from "@/components/admin/products/cell-action";
import { useState } from "react";
import { centsToReais, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-10 h-14 rounded-sm overflow-hidden bg-muted shrink-0">
      {isLoading && <Skeleton className="absolute inset-0" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="40px"
        className={cn(
          "object-cover rounded-sm transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}

export const columns: ColumnDef<ProductOutput>[] = [
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
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const name = row.original.name;
      const image = row.original.imageUrl;
      return (
        <div className="flex items-center gap-2">
          <ProductImage
            src={image || "/images/image-placeholder.jpg"}
            alt={name}
          />
          {name.length > 30 ? (
            <Tooltip>
              <TooltipTrigger className="cursor-pointer" asChild>
                <span className="w-34 truncate cursor-default font-semibold">
                  {name}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>{name}</span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link href={`/admin/products/${row.original.id}`}>
              <span className="font-semibold">{name}</span>
            </Link>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: "Categoria",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "basePrice",
    header: "Preço",
    cell: ({ row }) => {
      const price = row.original.basePrice;
      return <span>{centsToReais(price)}</span>;
    },
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.isAvailable;
      return status ? (
        <Badge className="bg-green-600">Disponível</Badge>
      ) : (
        <Badge variant="destructive">Indisponível</Badge>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Destaque",
    cell: ({ row }) => {
      const isFeatured = row.original.isFeatured;
      return isFeatured ? (
        <Badge variant="default">Destacado</Badge>
      ) : (
        <Badge variant="secondary">Não Destacado</Badge>
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
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <ProductsCellAction id={row.original.id} />,
  },
];
