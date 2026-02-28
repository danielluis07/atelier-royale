"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAZILIAN_STATES } from "@/constants";
import { Section } from "@/components/store/account/profile/section";
import { useCreateUserProfile } from "@/modules/users/hooks";
import { userProfileFormSchema } from "@/modules/users/validations";
import {
  digitsOnly,
  formatCep,
  formatCpfCnpj,
  formatPhoneBR,
} from "@/lib/utils";

const inputClasses =
  "h-11 rounded-none border-border bg-transparent font-sans text-sm tracking-wide placeholder:text-muted-foreground/50 focus-visible:border-foreground focus-visible:ring-0";

const labelClasses =
  "text-[10px] tracking-[0.25em] uppercase font-sans text-foreground mb-2 block";

export const ProfileForm = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync } = useCreateUserProfile();

  const form = useForm<z.input<typeof userProfileFormSchema>>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      document: "",
      phone: "",
      birthDate: "",
      address: {
        label: "Casa",
        recipientName: "",
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "SC",
        isDefault: true,
      },
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit: SubmitHandler<z.input<typeof userProfileFormSchema>> = async (
    value,
  ) => {
    setIsLoading(true);

    const payload = {
      ...value,
      document: value.document ? digitsOnly(value.document) : undefined,
      phone: value.phone ? digitsOnly(value.phone) : undefined,
      address: {
        ...value.address,
        zipCode: digitsOnly(value.address.zipCode),
      },
    };

    toast.promise(mutateAsync(payload), {
      loading: "Salvando...",
      success: "Salvo com sucesso!",
      error: (error) => {
        console.error(error);
        return "Erro ao salvar perfil";
      },
      finally: () => setIsLoading(false),
    });
  };

  return (
    <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
      {/* ─── Personal Data ─── */}
      <Section
        icon={User}
        title="Dados pessoais"
        description="Informações básicas da sua conta">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
          {/* Name (NOT in schema yet) */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className={labelClasses}>
              Nome completo
            </label>
            <Input
              id="name"
              placeholder="João Silva"
              className={inputClasses}
              readOnly
              defaultValue={name}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="m@exemplo.com"
              readOnly
              className={inputClasses}
              defaultValue={email}
            />
            <p className="font-sans text-[10px] text-muted-foreground mt-2 tracking-wide">
              O email não pode ser alterado
            </p>
          </div>

          {/* Phone */}
          <div>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="phone" className={labelClasses}>
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(formatPhoneBR(e.target.value))
                    }
                    onBlur={field.onBlur}
                    disabled={isLoading}
                    placeholder="(11) 99999-9999"
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Document */}
          <div>
            <Controller
              name="document"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="document" className={labelClasses}>
                    CPF / CNPJ
                  </label>
                  <Input
                    {...field}
                    id="document"
                    placeholder="000.000.000-00"
                    onChange={(e) =>
                      field.onChange(formatCpfCnpj(e.target.value))
                    }
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Birth Date */}
          <div>
            <Controller
              name="birthDate"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="birthDate" className={labelClasses}>
                    Data de nascimento
                  </label>
                  <Input
                    {...field}
                    id="birthDate"
                    type="date"
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </Section>

      {/* ─── Address ─── */}
      <Section
        icon={MapPin}
        title="Endereço principal"
        description="Endereço de entrega padrão">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7">
          {/* Label */}
          <div>
            <Controller
              name="address.label"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="addressLabel" className={labelClasses}>
                    Identificação
                  </label>
                  <Input
                    {...field}
                    id="addressLabel"
                    placeholder="Ex: Casa, Trabalho"
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Recipient */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Controller
              name="address.recipientName"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="recipientName" className={labelClasses}>
                    Nome do destinatário
                  </label>
                  <Input
                    {...field}
                    id="recipientName"
                    placeholder="João Silva"
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* CEP */}
          <div>
            <Controller
              name="address.zipCode"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="zipCode" className={labelClasses}>
                    CEP
                  </label>
                  <Input
                    id="zipCode"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(formatCep(e.target.value))}
                    onBlur={field.onBlur}
                    disabled={isLoading}
                    placeholder="00000-000"
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Street */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Controller
              name="address.street"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="street" className={labelClasses}>
                    Rua / Logradouro
                  </label>
                  <Input
                    {...field}
                    id="street"
                    placeholder="Rua das Flores"
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Number */}
          <div>
            <Controller
              name="address.number"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="number" className={labelClasses}>
                    Número
                  </label>
                  <Input
                    {...field}
                    id="number"
                    placeholder="123"
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Complement */}
          <div>
            <Controller
              name="address.complement"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="complement" className={labelClasses}>
                    Complemento
                  </label>
                  <Input
                    {...field}
                    id="complement"
                    placeholder="Apto 45, Bloco B"
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Neighborhood */}
          <div>
            <Controller
              name="address.neighborhood"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="neighborhood" className={labelClasses}>
                    Bairro
                  </label>
                  <Input
                    {...field}
                    id="neighborhood"
                    placeholder="Centro"
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* City */}
          <div>
            <Controller
              name="address.city"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="city" className={labelClasses}>
                    Cidade
                  </label>
                  <Input
                    {...field}
                    id="city"
                    placeholder="São Paulo"
                    disabled={isLoading}
                    className={inputClasses}
                  />
                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* State (select) */}
          <div>
            <Controller
              name="address.state"
              control={control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid}>
                  <label htmlFor="state" className={labelClasses}>
                    Estado
                  </label>

                  <select
                    id="state"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={isLoading}
                    className={`${inputClasses} w-full border border-border px-3 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_0.75rem_center]`}>
                    <option value="" disabled>
                      Selecione
                    </option>
                    {BRAZILIAN_STATES.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>

                  {fieldState.error && (
                    <p className="mt-2 font-sans text-[10px] text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </Section>

      {/* ─── Submit ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <p className="font-sans text-xs text-muted-foreground tracking-wide">
          As alterações serão salvas automaticamente no seu perfil
        </p>

        <Button
          type="submit"
          variant="luxury"
          className="h-12 px-10 text-xs"
          disabled={isLoading}>
          <Save className="w-4 h-4" strokeWidth={1.5} />
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
};
