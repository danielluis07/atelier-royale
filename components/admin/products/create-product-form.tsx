"use client";

import { z } from "zod";
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
import { centsToReais, compressImageToWebP } from "@/lib/utils";
import { useCreateProduct } from "@/modules/products/hooks";
import { getUploadUrl } from "@/actions/get-upload-url";
import { createProductInput } from "@/modules/products/validations";

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

  const form = useForm<z.input<typeof createProductInput>>({
    resolver: zodResolver(createProductInput),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      basePrice: 0,
      imageUrl: "",
      isAvailable: true,
      isFeatured: false,
      categoryId: "",
      variants: [
        {
          sku: "",
          name: "",
          stockQuantity: 1,
        },
      ],
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (value: z.input<typeof createProductInput>) => {
    if (!imageFile) {
      setImageError("A imagem do produto é obrigatória");
      return;
    }

    setIsLoading(true);
    setImageError(null);
    toast.loading("Criando o produto...", { id: "create-product" });

    try {
      const finalImageFile = await compressImageToWebP(imageFile);

      const urlResult = await getUploadUrl(
        finalImageFile.name,
        finalImageFile.type,
        finalImageFile.size,
        "products",
      );

      if (!urlResult.success || !urlResult.uploadUrl || !urlResult.publicUrl) {
        toast.error(urlResult.error ?? "Erro ao gerar link de upload", {
          id: "create-product",
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
          id: "create-product",
        });
        setIsLoading(false);
        return;
      }

      await mutateAsync({
        ...value,
        name: value.name.trim(),
        description: value.description.trim(),
        imageUrl: urlResult.publicUrl,
      });

      router.push("/admin/products");

      toast.success("Produto criado com sucesso!", { id: "create-product" });
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast.error("Ocorreu um erro inesperado. Tente novamente", {
        id: "create-product",
      });
    } finally {
      setIsLoading(false);
    }
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
            aria-label="Voltar"
            onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>{" "}
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
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
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
          {/* Is Featured */}
          <Card>
            <CardHeader>
              <CardTitle>Destaque</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <Field
                    orientation="horizontal"
                    className="flex justify-between">
                    <FieldDescription>
                      Marque se este produto deve ser exibido em destaque na
                      loja
                    </FieldDescription>{" "}
                    <Switch
                      id="isFeatured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />
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
