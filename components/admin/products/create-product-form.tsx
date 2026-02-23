"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ClientSelect } from "@/components/ui/custom/select/client-select";
import { ArrowLeft } from "lucide-react";
import { VariantsField } from "@/components/admin/products/variants-field";
import { UploadImage } from "@/components/admin/products/upload-image";
import { centsToReais } from "@/lib/utils";
import { useCreateProduct } from "@/modules/products/hooks";
import { uploadFile } from "@/actions/upload-file";
import { createProductFormInput } from "@/modules/products/validations";
import type { CreateProductFormValues } from "@/modules/products/types";

export const CreateProductForm = ({
  categories,
}: {
  categories: {
    id: string;
    name: string;
  }[];
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const { mutateAsync } = useCreateProduct();

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductFormInput),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      basePrice: 0,
      isAvailable: true,
      categoryId: null,
      variants: [],
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (value: CreateProductFormValues) => {
    if (!imageFile) {
      setImageError("A imagem do produto é obrigatória");
      return;
    }

    setIsLoading(true);

    setImageError(null);

    const formData = new FormData();
    formData.append("file", imageFile);

    const uploadResult = await uploadFile(formData, "products");

    if (!uploadResult.success || !uploadResult.url) {
      toast.error(uploadResult.error ?? "Erro ao enviar imagem");
      setIsLoading(false);
      return;
    }

    toast.promise(mutateAsync({ ...value, imageUrl: uploadResult.url }), {
      loading: "Criando produto...",
      success: () => {
        setIsLoading(false);
        return "Produto criado com sucesso!";
      },
      error: (error) => {
        setIsLoading(false);
        console.error(error);
        return "Erro ao criar produto";
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Criar Produto</h1>
            <p className="text-sm text-muted-foreground">
              Preencha as informações do novo produto
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Produto"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column — Main Info */}
        <div className="flex flex-col space-y-6 h-full lg:col-span-2">
          {/* General Information */}
          <Card className="flex flex-col flex-1">
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Nome, marca e descrição do produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Nome</FieldLabel>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Ex: Terno Slim Fit"
                          disabled={isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error!]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="brand">Marca</FieldLabel>
                        <Input
                          {...field}
                          id="brand"
                          placeholder="Ex: Hugo Boss"
                          disabled={isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error!]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="categoryId">Categoria</FieldLabel>
                        <ClientSelect
                          id="categoryId"
                          value={field.value || ""}
                          onChange={field.onChange}
                          disabled={isLoading}
                          placeholder="Selecione a categoria"
                          options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                          }))}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error!]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="basePrice"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="basePrice">Preço Base</FieldLabel>
                        <Input
                          id="basePrice"
                          value={centsToReais(field.value)}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            const numericValue = rawValue
                              ? parseInt(rawValue, 10)
                              : 0;
                            field.onChange(numericValue);
                          }}
                          disabled={isLoading}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error!]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">Descrição</FieldLabel>
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Descreva o produto em detalhes..."
                        className="h-44 resize-none"
                        disabled={isLoading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error!]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Sidebar */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1 flex flex-col min-h-0">
            <UploadImage
              file={imageFile}
              onFileChange={(file) => {
                setImageFile(file);
                if (file) setImageError(null);
              }}
              disabled={isLoading}
            />
            {imageError && (
              <p className="mt-2 text-sm text-destructive">{imageError}</p>
            )}
          </div>
        </div>

        {/* Variants — Full Width */}
        <div className="lg:col-span-3">
          <VariantsField control={control} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-3">
          {/* TODO: Is Featured */}
          <Card>
            <CardHeader>
              <CardTitle>Destaque</CardTitle>
            </CardHeader>
            <CardContent>
              <Field orientation="horizontal" className="flex justify-between">
                <FieldDescription>
                  Marque se este produto deve ser exibido na seção de destaques
                </FieldDescription>
                <Switch id="isFeatured" disabled={isLoading} />
              </Field>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <Field
                    orientation="horizontal"
                    className="flex justify-between">
                    <FieldDescription>
                      Marque se este produto está disponível para venda
                    </FieldDescription>
                    <Switch
                      id="isAvailable"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};
