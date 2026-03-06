import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { inter } from "@/fonts";
import { TRPCReactProvider } from "@/trpc/client";
import { NotificationProvider } from "@/providers/notifications-provider";

export const metadata: Metadata = {
  title: "Atelier Royale | Luxo & Elegância",
  description:
    "Curadoria de peças excepcionais para aqueles que entendem que o verdadeiro luxo está na qualidade, na história e no detalhe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-inter antialiased`}>
        <TRPCReactProvider>
          <NotificationProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </NotificationProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
