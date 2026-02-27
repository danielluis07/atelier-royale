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
import { PasswordInput } from "@/components/ui/custom/password-input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { authClient, getErrorMessage } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signInInput } from "@/validations/auth";

export const LoginForm = () => {
  const { signIn } = authClient;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signInInput>>({
    resolver: zodResolver(signInInput),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (value: z.infer<typeof signInInput>) => {
    await signIn.email(
      {
        email: value.email,
        password: value.password,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: async (ctx) => {
          setIsLoading(false);
          router.push(`/${ctx.data.user.role}`);
        },
        onError: (ctx) => {
          console.error("Sign-in error:", ctx.error);
          toast.error(getErrorMessage(ctx.error.code, "ptBr"));
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl tracking-tight text-foreground mb-3">
          Bem-vindo de volta
        </h1>
        <p className="font-sans text-sm text-muted-foreground tracking-wide">
          Informe seus dados para acessar sua conta
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

          {/* Password */}
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

          {/* Actions */}
          <div className="mt-4">
            <Button
              type="submit"
              variant="luxury"
              disabled={isLoading}
              className="w-full h-12 text-xs">
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <FieldDescription
              className={cn(
                "pt-6 text-center font-sans text-sm text-muted-foreground",
                isLoading && "pointer-events-none opacity-50",
              )}>
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-foreground hover:text-primary transition-colors duration-300 underline underline-offset-4">
                Cadastre-se
              </Link>
            </FieldDescription>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};
