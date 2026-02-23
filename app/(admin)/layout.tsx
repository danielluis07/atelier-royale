import { ConfirmProvider } from "@/providers/confirm-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfirmProvider>
      <main className="min-h-screen">{children}</main>
    </ConfirmProvider>
  );
}
