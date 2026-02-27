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
import { compressImageToWebP } from "@/lib/utils";
import { getUploadUrl } from "@/actions/get-upload-url";
import { deleteFile } from "@/actions/delete-file";
import { Textarea } from "@/components/ui/textarea";
import { UploadCategoryImage } from "./upload-category-image";

export const UpdateCategoryDialog = ({
  id,
  name,
  imageUrl,
  description,
  isOpen,
  onOpenChange,
}: {
  id: string;
  name: string;
  imageUrl: string;
  description: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<
    string | null | undefined
  >(undefined);

  const form = useForm<z.infer<typeof updateCategoryInput>>({
    resolver: zodResolver(updateCategoryInput),
    defaultValues: {
      id,
      name,
      imageUrl,
      description,
    },
  });

  const categoryImageUrl = imageUrl;

  const currentImageUrl =
    existingImageUrl !== undefined ? existingImageUrl : categoryImageUrl;

  const { mutateAsync } = useUpdateCategory();

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    reset({ id, name, imageUrl, description });
  }, [id, name, imageUrl, description, reset]);

  const onSubmit = async (value: z.infer<typeof updateCategoryInput>) => {
    if (!imageFile && !currentImageUrl) {
      toast.error("O produto precisa de uma imagem");
      return;
    }

    setIsLoading(true);
    toast.loading("Atualizando categoria...", { id: "update-category" });

    let imageUrl = currentImageUrl;
    const previousImageUrl = categoryImageUrl;

    try {
      if (imageFile) {
        const finalImageFile = await compressImageToWebP(imageFile);

        const urlResult = await getUploadUrl(
          finalImageFile.name,
          finalImageFile.type,
          finalImageFile.size,
          "categories", // Use "temp" here if you adopted the Temp Folder lifecycle pattern!
        );

        if (
          !urlResult.success ||
          !urlResult.uploadUrl ||
          !urlResult.publicUrl
        ) {
          toast.error(urlResult.error ?? "Erro ao gerar link de upload", {
            id: "update-category",
          });
          setIsLoading(false);
          return;
        }

        const uploadResponse = await fetch(urlResult.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": finalImageFile.type },
          body: finalImageFile,
        });

        if (!uploadResponse.ok) {
          toast.error("Erro ao enviar a nova imagem para o S3", {
            id: "update-product",
          });
          setIsLoading(false);
          return;
        }

        imageUrl = urlResult.publicUrl;
      }

      await mutateAsync({
        ...value,
        imageUrl: imageUrl!,
      });

      if (imageFile && previousImageUrl && previousImageUrl !== imageUrl) {
        // We run this in the background (fire-and-forget) so it doesn't delay the UI redirect
        deleteFile(previousImageUrl).then((res) => {
          if (!res.success)
            console.error("Erro ao deletar imagem antiga:", res.error);
        });
      }

      toast.success("Categoria atualizada com sucesso!", {
        id: "update-category",
      });
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria", { id: "update-category" });
    } finally {
      setIsLoading(false);
      reset();
      setImageFile(null);
      onOpenChange(false);
    }
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

            <UploadCategoryImage
              file={imageFile}
              onFileChange={(file) => {
                setImageFile(file);
              }}
              existingUrl={currentImageUrl}
              onExistingUrlClear={() => setExistingImageUrl(null)}
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
