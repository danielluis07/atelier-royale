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
import { authClient } from "@/lib/auth-client";
import { useConfirm } from "@/providers/confirm-provider";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export const UsersCellAction = ({
  id,
  banned,
}: {
  id: string;
  banned: boolean;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const hasMounted = useHasMounted();

  const { confirm, closeConfirm, setPending } = useConfirm();

  const handleUserBun = async (id: string) => {
    const confirmed = await confirm(
      "Tem certeza que deseja banir este usuário?",
      "Ao continuar, este usuário não poderá mais acessar a plataforma.",
    );

    if (confirmed) {
      setPending(true);
      await authClient.admin.banUser(
        {
          userId: id,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(
              trpc.users.list.queryOptions({ perPage: 10 }),
            );
            setPending(false);
            closeConfirm();
            toast.success("Usuário banido com sucesso");
          },
          onError: (error) => {
            console.error(error);
            setPending(false);
            console.error("Falha ao banir usuário");
            toast.error("Falha ao banir usuário");
          },
        },
      );
    }
  };

  const handleUserUnbun = async (id: string) => {
    const confirmed = await confirm(
      "Tem certeza que deseja reabilitar este usuário?",
      "Ao continuar, este usuário poderá acessar a plataforma novamente.",
    );

    if (confirmed) {
      await authClient.admin.unbanUser(
        {
          userId: id,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(trpc.users.list.queryOptions({}));
            setPending(false);
            closeConfirm();
            toast.success("Usuário reabilitado com sucesso");
          },
          onError: (error) => {
            console.error(error);
            setPending(false);
            toast.error("Falha ao reabilitar usuário");
          },
        },
      );
    }
  };

  if (!hasMounted) {
    return <Skeleton className="h-5 w-8 my-1.5" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {banned ? (
          <DropdownMenuItem onClick={() => handleUserUnbun(id)}>
            Reabilitar Usuário
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleUserBun(id)}>
            Banir Usuário
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
