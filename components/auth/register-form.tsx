"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { signUpInput } from "@/validations/auth";
import { useState } from "react";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { getErrorMessage } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/custom/password-input";
import { toast } from "sonner";

export const RegisterForm = () => {
  // const { signUp } = authClient;
  // const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpInput>>({
    resolver: zodResolver(signUpInput),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeat_password: "",
    },
  });

  const { control, handleSubmit } = form;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (value: z.infer<typeof signUpInput>) => {
    toast.warning("Por enquanto apenas o administrador pode criar contas.");

    /*     await signUp.email(
      {
        email: value.email,
        password: value.password,
        name: value.name,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async () => {
          setIsLoading(false);
          router.push(`/`);
        },
        onError: (ctx) => {
          console.error("Sign-up error:", ctx.error);
          toast.error(getErrorMessage(ctx.error.code, "ptBr"));
          setIsLoading(false);
        },
      },
    ); */
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl tracking-tight text-foreground mb-3">
          Criar sua conta
        </h1>
        <p className="font-sans text-sm text-muted-foreground tracking-wide">
          Preencha os dados abaixo para se cadastrar
        </p>
      </div>

      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px flex-1 bg-border" />
        <div className="w-1.5 h-1.5 rotate-45 border border-primary/40" />
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Nome */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="name"
                  className="text-[10px] tracking-[0.25em] uppercase font-sans text-foreground">
                  Nome completo
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  placeholder="João Silva"
                  disabled={isLoading}
                  className="h-11 rounded-none border-border bg-transparent font-sans text-sm tracking-wide placeholder:text-muted-foreground/50 focus-visible:border-foreground focus-visible:ring-0"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error!]} />
                )}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="email"
                  className="text-[10px] tracking-[0.25em] uppercase font-sans text-foreground">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  disabled={isLoading}
                  className="h-11 rounded-none border-border bg-transparent font-sans text-sm tracking-wide placeholder:text-muted-foreground/50 focus-visible:border-foreground focus-visible:ring-0"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error!]} />
                )}
              </Field>
            )}
          />

          {/* Senhas */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="password"
                    className="text-[10px] tracking-[0.25em] uppercase font-sans text-foreground">
                    Senha
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="password"
                    disabled={isLoading}
                    className="h-11 rounded-none border-border bg-transparent font-sans text-sm tracking-wide focus-visible:border-foreground focus-visible:ring-0"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error!]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="repeat_password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="repeat_password"
                    className="text-[10px] tracking-[0.25em] uppercase font-sans text-foreground">
                    Confirmar senha
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="repeat_password"
                    disabled={isLoading}
                    className="h-11 rounded-none border-border bg-transparent font-sans text-sm tracking-wide focus-visible:border-foreground focus-visible:ring-0"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error!]} />
                  )}
                </Field>
              )}
            />
          </div>

          <FieldDescription className="font-sans text-xs text-muted-foreground tracking-wide">
            A senha deve ter pelo menos 8 caracteres.
          </FieldDescription>

          {/* Submit */}
          <div className="mt-4">
            <Button
              type="submit"
              variant="luxury"
              disabled={isLoading}
              className="w-full h-12 text-xs">
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>

            <FieldDescription
              className={cn(
                "pt-6 text-center font-sans text-sm text-muted-foreground",
                isLoading && "pointer-events-none opacity-50",
              )}>
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-foreground hover:text-primary transition-colors duration-300 underline underline-offset-4">
                Entrar
              </Link>
            </FieldDescription>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};
