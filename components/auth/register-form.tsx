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
import { Controller, useForm } from "react-hook-form";
import { signUpInput } from "@/validations/auth";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/custom/password-input";
import { toast } from "sonner";

export const RegisterForm = () => {
  const { signUp } = authClient;
  const router = useRouter();

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

  const onSubmit = async (value: z.infer<typeof signUpInput>) => {
    toast.warning("Por enquanto apenas o administrador pode criar contas.");

    await signUp.email(
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
          router.push(`/admin`);
        },
        onError: (ctx) => {
          console.error("Sign-up error:", ctx.error);
          toast.error(getErrorMessage(ctx.error.code, "ptBr"));
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Card className="mx-auto w-full max-w-md mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Criar conta</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para criar sua conta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Nome */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="João Silva"
                    disabled={isLoading}
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

            {/* Senhas */}
            <div className="grid grid-cols-2 gap-4">
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

              <Controller
                name="repeat_password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="repeat_password">
                      Confirmar senha
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="repeat_password"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error!]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <FieldDescription>
              A senha deve ter pelo menos 8 caracteres.
            </FieldDescription>

            {/* Submit */}
            <div className="mt-6">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>

              <FieldDescription
                className={cn(
                  "pt-4 text-center",
                  isLoading && "pointer-events-none opacity-50",
                )}>
                Já tem uma conta?{" "}
                <Link href="/login" className="underline">
                  Entrar
                </Link>
              </FieldDescription>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
