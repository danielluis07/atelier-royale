"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import type { UserOutput } from "@/modules/users/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UsersCellAction } from "@/components/admin/users/cell-action";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<UserOutput>[] = [
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
      const image = row.original.image;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={image || "/images/user-placeholder.jpg"}
            alt={name}
            width={32}
            height={32}
            className="rounded-full"
          />
          {name.length > 30 ? (
            <Tooltip>
              <TooltipTrigger className="cursor-pointer" asChild>
                <Link
                  className="w-24 truncate cursor-default font-semibold"
                  href={`/admin/users/${row.original.id}`}>
                  <span>{name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <span>{name}</span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link href={`/admin/users/${row.original.id}`}>
              <span className="font-semibold">{name}</span>
            </Link>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.banned;
      return status ? (
        <Badge variant="destructive">Banido</Badge>
      ) : (
        <Badge variant="default">Ativo</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Cadastro em",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return format(createdAt, "dd/MM/yyyy", { locale: ptBR });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <UsersCellAction id={row.original.id} banned={row.original.banned} />
    ),
  },
];
