"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="w-full flex items-center justify-center gap-2.5 py-3 text-xs tracking-[0.2em] uppercase font-sans text-muted-foreground border border-border hover:border-foreground hover:text-foreground transition-colors duration-300">
      <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
      Sair da conta
    </button>
  );
};
