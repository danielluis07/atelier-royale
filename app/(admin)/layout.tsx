import { ConfirmProvider } from "@/providers/confirm-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfirmProvider>
      <div className="min-h-screen">{children}</div>
    </ConfirmProvider>
  );
}
