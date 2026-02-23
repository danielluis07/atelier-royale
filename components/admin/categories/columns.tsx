"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CategoriesCellAction } from "@/components/admin/categories/cell-action";
import type { CategoryOutput } from "@/modules/categories/types";

export const getColumns = (
  onEdit: (category: { id: string; name: string }) => void,
): ColumnDef<CategoryOutput>[] => [
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
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CategoriesCellAction
        onEdit={() => onEdit({ id: row.original.id, name: row.original.name })}
      />
    ),
  },
];
