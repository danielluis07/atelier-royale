"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";

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
import { createCategoryInput } from "@/modules/categories/validations";
import { Plus } from "lucide-react";
import { useCreateCategory } from "@/modules/categories/hooks";
import { useHasMounted } from "@/hooks/use-has-mounted";

export const CreateCategoryDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hasMounted = useHasMounted();

  const form = useForm<z.infer<typeof createCategoryInput>>({
    resolver: zodResolver(createCategoryInput),
    defaultValues: {
      name: "",
    },
  });

  const create = useCreateCategory();

  const { control, handleSubmit, reset } = form;

  const onSubmit = (value: z.infer<typeof createCategoryInput>) => {
    setIsLoading(true);
    create.mutate(value, {
      onSuccess: () => {
        toast.success("Categoria criada com sucesso!");
        reset();
        setIsOpen(false);
        setIsLoading(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          error?.message || "Erro ao criar categoria. Tente novamente.",
        );
        setIsLoading(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={!hasMounted}
        aria-disabled={!hasMounted}>
        <Plus />
        Criar Categoria
      </Button>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>Criar Categoria</DialogTitle>
            <DialogDescription>Crie uma nova categoria.</DialogDescription>
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
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
