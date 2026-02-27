"use client";

import { DataTable } from "@/components/ui/custom/data-table";
import { getColumns } from "@/components/admin/categories/columns";
import { CreateCategoryDialog } from "@/components/admin/categories/create-category-dialog";
import { useConfirm } from "@/providers/confirm-provider";
import { toast } from "sonner";
import {
  useCategoriesSuspense,
  useDeleteCategories,
} from "@/modules/categories/hooks";
import { UpdateCategoryDialog } from "@/components/admin/categories/update-category-dialog";
import { useMemo, useState } from "react";

export const CategoriesClient = () => {
  const { data } = useCategoriesSuspense();

  const { mutate } = useDeleteCategories();

  const { closeConfirm, setPending } = useConfirm();

  const [categoryToEdit, setCategoryToEdit] = useState<{
    id: string;
    name: string;
    imageUrl: string;
    description: string | null;
  } | null>(null);

  const columns = useMemo(() => getColumns(setCategoryToEdit), []);

  return (
    <>
      <UpdateCategoryDialog
        id={categoryToEdit?.id ?? ""}
        name={categoryToEdit?.name ?? ""}
        imageUrl={categoryToEdit?.imageUrl ?? ""}
        description={categoryToEdit?.description ?? null}
        isOpen={!!categoryToEdit}
        onOpenChange={(isOpen) => {
          if (!isOpen) setCategoryToEdit(null);
        }}
      />
      <DataTable
        data={data}
        columns={columns}
        simplePagination={true}
        simpleSearch={true}
        additionalButton={<CreateCategoryDialog />}
        searchKey="name"
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id);
          mutate(
            { ids },
            {
              onSuccess: () => {
                toast.success("Categoria(s) deletada(s) com sucesso!");
              },
              onSettled: () => {
                closeConfirm();
                setPending(false);
              },
              onError: (error) => {
                console.error(error);
                toast.error(error.message || "Erro ao deletar categoria(s)");
              },
            },
          );
        }}
      />
    </>
  );
};
