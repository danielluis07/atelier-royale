"use client";

import { useFieldArray, Controller, type Control } from "react-hook-form";
import { Plus, Trash2, Package } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { centsToReais } from "@/lib/utils";

export const VariantsField = ({
  control,
  isLoading,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  isLoading: boolean;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Variações</CardTitle>
            <CardDescription>
              Adicione variações como tamanho, cor ou estoque
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                sku: "",
                name: "",
                size: null,
                priceOverride: null,
                stockQuantity: 0,
                weightGrams: null,
                heightCm: null,
                widthCm: null,
                lengthCm: null,
              })
            }
            disabled={isLoading}>
            <Plus className="mr-1 size-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
            <Package className="mb-3 size-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">
              Nenhuma variação adicionada
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Clique em &quot;Adicionar&quot; para criar uma variação
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((variantField, index) => (
              <div key={variantField.id}>
                {index > 0 && <Separator className="mb-6" />}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Variação {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (fields.length > 1) {
                          remove(index);
                        }
                      }}
                      aria-label={`Remover variação ${index + 1}`}
                      disabled={isLoading || fields.length === 1}>
                      <Trash2 className="size-4" />
                    </Button>{" "}
                  </div>

                  <FieldGroup>
                    {/* SKU, Name, Size */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Controller
                        name={`variants.${index}.sku`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`variants.${index}.sku`}>
                              SKU
                            </FieldLabel>
                            <Input
                              {...field}
                              id={`variants.${index}.sku`}
                              placeholder="Ex: TRN-SLM-42"
                              disabled={isLoading}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`variants.${index}.name`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`variants.${index}.name`}>
                              Nome
                            </FieldLabel>
                            <Input
                              {...field}
                              id={`variants.${index}.name`}
                              placeholder="Ex: Tamanho"
                              disabled={isLoading}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`variants.${index}.size`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`variants.${index}.size`}>
                              Variação
                            </FieldLabel>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              id={`variants.${index}.size`}
                              placeholder="Ex: 42, P, M, G"
                              disabled={isLoading}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* Price Override & Stock */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Controller
                        name={`variants.${index}.priceOverride`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              htmlFor={`variants.${index}.priceOverride`}>
                              Preço Específico
                            </FieldLabel>
                            <Input
                              id={`variants.${index}.priceOverride`}
                              name={field.name}
                              ref={field.ref}
                              placeholder="Ex: R$ 10,00 (opcional)"
                              disabled={isLoading}
                              value={
                                field.value == null
                                  ? ""
                                  : centsToReais(field.value)
                              }
                              onBlur={field.onBlur}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /\D/g,
                                  "",
                                );
                                if (rawValue === "") {
                                  field.onChange(null);
                                } else {
                                  const numericValue = parseInt(rawValue, 10);
                                  field.onChange(numericValue);
                                }
                              }}
                            />
                            <FieldDescription>
                              Se vazio, usa o preço base do produto
                            </FieldDescription>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />{" "}
                      <Controller
                        name={`variants.${index}.stockQuantity`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              htmlFor={`variants.${index}.stockQuantity`}>
                              Estoque
                            </FieldLabel>
                            <Input
                              id={`variants.${index}.stockQuantity`}
                              name={field.name}
                              ref={field.ref}
                              type="number"
                              min={0}
                              disabled={isLoading}
                              value={field.value}
                              onBlur={field.onBlur}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <Controller
                        name={`variants.${index}.weightGrams`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              htmlFor={`variants.${index}.weightGrams`}>
                              Peso (g)
                            </FieldLabel>
                            <Input
                              id={`variants.${index}.weightGrams`}
                              name={field.name}
                              ref={field.ref}
                              type="number"
                              placeholder="Gramas"
                              disabled={isLoading}
                              value={field.value ?? ""}
                              onBlur={field.onBlur}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                                )
                              }
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`variants.${index}.heightCm`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`variants.${index}.heightCm`}>
                              Altura (cm)
                            </FieldLabel>
                            <Input
                              id={`variants.${index}.heightCm`}
                              name={field.name}
                              ref={field.ref}
                              type="number"
                              placeholder="cm"
                              disabled={isLoading}
                              value={field.value ?? ""}
                              onBlur={field.onBlur}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                                )
                              }
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`variants.${index}.widthCm`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`variants.${index}.widthCm`}>
                              Largura (cm)
                            </FieldLabel>
                            <Input
                              id={`variants.${index}.widthCm`}
                              name={field.name}
                              ref={field.ref}
                              type="number"
                              placeholder="cm"
                              disabled={isLoading}
                              value={field.value ?? ""}
                              onBlur={field.onBlur}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                                )
                              }
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`variants.${index}.lengthCm`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`variants.${index}.lengthCm`}>
                              Comp. (cm)
                            </FieldLabel>
                            <Input
                              id={`variants.${index}.lengthCm`}
                              name={field.name}
                              ref={field.ref}
                              type="number"
                              placeholder="cm"
                              disabled={isLoading}
                              value={field.value ?? ""}
                              onBlur={field.onBlur}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                                )
                              }
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error!]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </FieldGroup>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
