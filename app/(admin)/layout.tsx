import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Navbar } from "@/components/admin/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ConfirmProvider } from "@/providers/confirm-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfirmProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <Navbar />
          <div className="p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ConfirmProvider>
  );
}
