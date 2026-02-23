"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/providers/confirm-provider";
import { LogOut } from "lucide-react";

export function SidebarNav() {
  const router = useRouter();

  const { confirm, closeConfirm, setPending } = useConfirm();

  const handleLogout = async () => {
    const confirmed = await confirm(
      "Tem certeza que deseja sair?",
      "Ao continuar, você será desconectado da sua conta.",
    );

    if (confirmed) {
      setPending(true);

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setPending(false);
            closeConfirm();
            router.push("/login");
          },
          onError: (e) => {
            console.error("Sign-out error:", e);
            setPending(false);
            toast.error("Erro ao sair da conta. Tente novamente.");
          },
        },
      });
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleLogout}
          tooltip="Sair"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50">
          <LogOut className="size-4" />
          <span>Sair</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
