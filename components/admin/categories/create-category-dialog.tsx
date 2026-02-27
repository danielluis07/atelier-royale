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
import { createCategorySchema } from "@/modules/categories/validations";
import { Plus } from "lucide-react";
import { useCreateCategory } from "@/modules/categories/hooks";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { compressImageToWebP } from "@/lib/utils";
import { getUploadUrl } from "@/actions/get-upload-url";
import { Textarea } from "@/components/ui/textarea";
import { UploadCategoryImage } from "@/components/admin/categories/upload-category-image";

export const CreateCategoryDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const hasMounted = useHasMounted();

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync } = useCreateCategory();

  const { control, handleSubmit, reset } = form;

  const onSubmit = async (value: z.infer<typeof createCategorySchema>) => {
    if (!imageFile) {
      toast.error("A imagem da categoria é obrigatória");
      return;
    }

    setIsLoading(true);
    toast.loading("Criando a categoria...", { id: "create-category" });

    try {
      const finalImageFile = await compressImageToWebP(imageFile);

      const urlResult = await getUploadUrl(
        finalImageFile.name,
        finalImageFile.type,
        finalImageFile.size,
        "categories",
      );

      if (!urlResult.success || !urlResult.uploadUrl || !urlResult.publicUrl) {
        toast.error(urlResult.error ?? "Erro ao gerar link de upload", {
          id: "create-category",
        });
        setIsLoading(false);
        return;
      }

      // 2. Upload the file directly to S3 using the ticket
      const uploadResponse = await fetch(urlResult.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": finalImageFile.type,
        },
        body: finalImageFile,
      });

      if (!uploadResponse.ok) {
        toast.error("Erro ao enviar imagem para o S3", {
          id: "create-category",
        });
        setIsLoading(false);
        return;
      }

      await mutateAsync({
        ...value,
        imageUrl: urlResult.publicUrl,
      });

      reset();
      setImageFile(null);
      setIsOpen(false);
      toast.success("Categoria criada com sucesso!", { id: "create-category" });
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast.error("Ocorreu um erro inesperado. Tente novamente", {
        id: "create-category",
      });
    } finally {
      setIsLoading(false);
    }
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

            <UploadCategoryImage
              file={imageFile}
              onFileChange={(file) => {
                setImageFile(file);
              }}
              disabled={isLoading}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    id="description"
                    placeholder="Uma breve descrição da categoria..."
                    className="h-20 resize-none"
                    maxLength={200}
                    disabled={isLoading}
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
