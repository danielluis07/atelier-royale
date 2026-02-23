"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateCategoryInput } from "@/modules/categories/validations";
import { useUpdateCategory } from "@/modules/categories/hooks";

export const UpdateCategoryDialog = ({
  id,
  name,
  isOpen,
  onOpenChange,
}: {
  id: string;
  name: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof updateCategoryInput>>({
    resolver: zodResolver(updateCategoryInput),
    defaultValues: {
      id,
      name,
    },
  });

  const update = useUpdateCategory();

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    reset({ id, name });
  }, [id, name, reset]);

  const onSubmit = (value: z.infer<typeof updateCategoryInput>) => {
    setIsLoading(true);
    update.mutate(value, {
      onSuccess: () => {
        toast.success("Categoria atualizada com sucesso!");
        reset();
        onOpenChange(false);
        setIsLoading(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          error?.message || "Erro ao atualizar categoria. Tente novamente.",
        );
        setIsLoading(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>Edite a categoria.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="name"
                    disabled={isLoading}
                    placeholder="Ex: Show, Festa, Workshop"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error!]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => form.reset()}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
