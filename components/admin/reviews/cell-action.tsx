"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useSetReviewApproval } from "@/modules/reviews/hooks";
import { useConfirm } from "@/providers/confirm-provider";
import {
  CircleCheck,
  CircleX,
  FileSearchCorner,
  MoreHorizontal,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const ReviewsCellAction = ({
  id,
  isApproved,
}: {
  id: string;
  isApproved: boolean;
}) => {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync } = useSetReviewApproval();

  const { confirm, closeConfirm, setPending } = useConfirm();

  const params = searchParams.toString();
  const editPath = params
    ? `/admin/reviews/${id}?${params}`
    : `/admin/reviews/${id}`;

  const handleApproval = async (isApproved: boolean) => {
    const confirmed = await confirm(
      `Tem certeza que deseja ${isApproved ? "aprovar" : "reprovar"} esta review?`,
      "Deseja continuar?",
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

  if (!hasMounted) {
    return <Skeleton className="h-5 w-8 my-1.5" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(editPath)}>
          <FileSearchCorner />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleApproval(!isApproved)}>
          {isApproved ? (
            <CircleX className="mr-2 size-4 text-red-500" />
          ) : (
            <CircleCheck className="mr-2 size-4 text-green-500" />
          )}
          {isApproved ? "Reprovar" : "Aprovar"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
