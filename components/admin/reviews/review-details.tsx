"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  ShieldAlert,
  Star,
  User2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useReviewSuspense,
  useSetReviewApproval,
} from "@/modules/reviews/hooks";
import { useConfirm } from "@/providers/confirm-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function StarsDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;

        return (
          <Star
            key={index}
            className={cn(
              "size-5",
              filled
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30",
            )}
          />
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
    </div>
  );
}

export const ReviewDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data } = useReviewSuspense(id);
  const { mutateAsync, isPending } = useSetReviewApproval();
  const { confirm, closeConfirm, setPending } = useConfirm();

  const handleApproval = async (isApproved: boolean) => {
    const confirmed = await confirm(
      `Tem certeza que deseja ${isApproved ? "aprovar" : "reprovar"} esta review?`,
      "O status da review será alterado imediatamente.",
    );

    if (confirmed) {
      setPending(true);

      try {
        await mutateAsync({
          id,
          isApproved,
        });

        closeConfirm();
        toast.success(
          `Review ${isApproved ? "aprovada" : "reprovada"} com sucesso!`,
        );
      } catch (err) {
        console.error(err);
        toast.error("Ocorreu um erro ao atualizar a review.");
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Voltar"
          onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Detalhes da review
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie a avaliação do cliente.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-border/60">
        <CardHeader className="gap-4 border-b bg-muted/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl font-semibold">
                  Detalhes da review
                </CardTitle>

                {data.isApproved ? (
                  <Badge className="bg-green-600 hover:bg-green-600">
                    Aprovada
                  </Badge>
                ) : (
                  <Badge variant="destructive">Reprovada</Badge>
                )}
              </div>

              <StarsDisplay rating={data.rating} />

              <div className="text-sm text-muted-foreground">
                Criada em{" "}
                {format(new Date(data.createdAt), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleApproval(true)}
                className="bg-green-600 hover:bg-green-500"
                disabled={isPending || data.isApproved}>
                <CheckCircle2 className="mr-2 size-4" />
                Aprovar
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-500"
                onClick={() => handleApproval(false)}
                disabled={isPending || !data.isApproved}>
                <ShieldAlert className="mr-2 size-4" />
                Reprovar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Comentário</CardTitle>
              </CardHeader>
              <CardContent>
                {data.comment ? (
                  <p className="whitespace-pre-line text-sm leading-7 text-foreground">
                    {data.comment}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    O usuário não deixou comentário nesta avaliação.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="size-4" />
                  Produto avaliado
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row">
                <div className="relative size-32 overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={data.product.imageUrl}
                    alt={data.product.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="font-medium">{data.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Slug: {data.product.slug}
                    </p>
                  </div>

                  <Link
                    href={`/products/${data.product.slug}`}
                    className="inline-flex text-sm font-medium text-primary hover:underline">
                    Ver página do produto
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User2 className="size-4" />
                  Autor da review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Nome</p>
                  <p className="font-medium">{data.user.name}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">E-mail</p>
                  <p className="break-all font-medium">{data.user.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {data.isApproved ? "Aprovada" : "Reprovada"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Nota</p>
                  <p className="font-medium">{data.rating} / 5</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Criada em</p>
                  <p className="font-medium">
                    {format(new Date(data.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
