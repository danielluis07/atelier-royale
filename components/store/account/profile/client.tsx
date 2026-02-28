"use client";

import Link from "next/link";
import { ArrowLeft, User, MapPin, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAZILIAN_STATES } from "@/constants";
import { toast } from "sonner";

const inputClasses =
  "h-11 rounded-none border-border bg-transparent font-sans text-sm tracking-wide placeholder:text-muted-foreground/50 focus-visible:border-foreground focus-visible:ring-0";

const labelClasses =
  "text-[10px] tracking-[0.25em] uppercase font-sans text-foreground mb-2 block";

/* ─── Section Wrapper ─── */
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border">
      {/* Section header */}
      <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-border bg-muted/30">
        <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-serif text-base text-foreground">{title}</h2>
          <p className="font-sans text-xs text-muted-foreground tracking-wide">
            {description}
          </p>
        </div>
      </div>

      {/* Section content */}
      <div className="px-6 sm:px-8 py-8">{children}</div>
    </div>
  );
}

/* ─── Main Profile Client ─── */
export const ProfileClient = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
      {/* Back link + Header */}
      <div className="mb-14">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          Minha conta
        </Link>

        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase font-sans text-primary mb-3 block">
            Perfil
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl tracking-tight text-foreground">
            Meus dados
          </h1>
        </div>
      </div>

      <form className="space-y-10">
        {/* ─── Personal Data ─── */}
        <Section
          icon={User}
          title="Dados pessoais"
          description="Informações básicas da sua conta">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
            {/* Name */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className={labelClasses}>
                Nome completo
              </label>
              <Input
                id="name"
                placeholder="João Silva"
                className={inputClasses}
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
                disabled
                className={inputClasses}
              />
              <p className="font-sans text-[10px] text-muted-foreground mt-2 tracking-wide">
                O email não pode ser alterado
              </p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className={labelClasses}>
                Telefone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                className={inputClasses}
              />
            </div>

            {/* Document (CPF/CNPJ) */}
            <div>
              <label htmlFor="document" className={labelClasses}>
                CPF / CNPJ
              </label>
              <Input
                id="document"
                placeholder="000.000.000-00"
                className={inputClasses}
              />
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className={labelClasses}>
                Data de nascimento
              </label>
              <Input id="birthDate" type="date" className={inputClasses} />
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
              <label htmlFor="addressLabel" className={labelClasses}>
                Identificação
              </label>
              <Input
                id="addressLabel"
                placeholder="Ex: Casa, Trabalho"
                className={inputClasses}
              />
            </div>

            {/* Recipient */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label htmlFor="recipientName" className={labelClasses}>
                Nome do destinatário
              </label>
              <Input
                id="recipientName"
                placeholder="João Silva"
                className={inputClasses}
              />
            </div>

            {/* CEP */}
            <div>
              <label htmlFor="zipCode" className={labelClasses}>
                CEP
              </label>
              <Input
                id="zipCode"
                placeholder="00000-000"
                className={inputClasses}
              />
            </div>

            {/* Street */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label htmlFor="street" className={labelClasses}>
                Rua / Logradouro
              </label>
              <Input
                id="street"
                placeholder="Rua das Flores"
                className={inputClasses}
              />
            </div>

            {/* Number */}
            <div>
              <label htmlFor="number" className={labelClasses}>
                Número
              </label>
              <Input id="number" placeholder="123" className={inputClasses} />
            </div>

            {/* Complement */}
            <div>
              <label htmlFor="complement" className={labelClasses}>
                Complemento
              </label>
              <Input
                id="complement"
                placeholder="Apto 45, Bloco B"
                className={inputClasses}
              />
            </div>

            {/* Neighborhood */}
            <div>
              <label htmlFor="neighborhood" className={labelClasses}>
                Bairro
              </label>
              <Input
                id="neighborhood"
                placeholder="Centro"
                className={inputClasses}
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className={labelClasses}>
                Cidade
              </label>
              <Input
                id="city"
                placeholder="São Paulo"
                className={inputClasses}
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className={labelClasses}>
                Estado
              </label>
              <select
                id="state"
                className={`${inputClasses} w-full border border-border px-3 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_0.75rem_center]`}
                defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {BRAZILIAN_STATES.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* ─── Submit ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <p className="font-sans text-xs text-muted-foreground tracking-wide">
            As alterações serão salvas automaticamente no seu perfil
          </p>
          <Button
            onClick={() => toast("Essa é apenas uma demonstração")}
            type="button"
            variant="luxury"
            className="h-12 px-10 text-xs">
            <Save className="w-4 h-4" strokeWidth={1.5} />
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
};
