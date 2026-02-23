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
    <Card className="mx-auto w-full max-w-md mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
        <CardDescription>
          Informe seu email e senha para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@exemplo.com"
                    disabled={isLoading}
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
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="password"
                    disabled={isLoading}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error!]} />
                  )}
                </Field>
              )}
            />

            {/* Actions */}
            <div className="mt-6">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              <FieldDescription
                className={cn(
                  "pt-4 text-center",
                  isLoading && "pointer-events-none opacity-50",
                )}>
                Não tem uma conta?{" "}
                <Link href="/register" className="underline">
                  Cadastre-se
                </Link>
              </FieldDescription>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
