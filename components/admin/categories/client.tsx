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
import type { Row } from "@tanstack/react-table";
import { deleteFiles } from "@/actions/delete-files";
import { TRPCClientError } from "@trpc/client";

export const CategoriesClient = () => {
  const { data } = useCategoriesSuspense();

  const { mutateAsync } = useDeleteCategories();

  const { closeConfirm, setPending } = useConfirm();

  const [categoryToEdit, setCategoryToEdit] = useState<{
    id: string;
    name: string;
    imageUrl: string;
    description: string | null;
  } | null>(null);

  const columns = useMemo(() => getColumns(setCategoryToEdit), []);

  const onDelete = async (
    row: Row<{
      id: string;
      name: string;
      imageUrl: string;
      description: string | null;
    }>[],
  ) => {
    const ids = row.map((r) => r.original.id);
    const imageUrls = row.map((r) => r.original.imageUrl);

    toast.loading(`Deletando ${ids.length} categoria(s)...`, {
      id: "delete-category",
    });
    setPending(true);

    try {
      await mutateAsync({ ids });

      await deleteFiles(imageUrls);

      closeConfirm();
      toast.success("Categoria(s) deletada(s) com sucesso!", {
        id: "delete-category",
      });
    } catch (error) {
      console.error(error);

      if (error instanceof TRPCClientError) {
        toast.error(error.message || "Erro ao deletar categoria(s)", {
          id: "delete-category",
        });
      } else {
        toast.error("Erro inesperado ao deletar categoria(s)", {
          id: "delete-category",
        });
      }
    } finally {
      setPending(false);
    }
  };

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
        onDelete={onDelete}
      />
    </>
  );
};
