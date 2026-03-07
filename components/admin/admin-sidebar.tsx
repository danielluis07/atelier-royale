import {
  FolderClosed,
  Home,
  MessageCircleMore,
  Package,
  Shirt,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/lib/auth-utils";

const items = [
  {
    title: "Início",
    url: "/admin",
    icon: <Home className="size-4" />,
  },
  {
    title: "Usuários",
    url: "/admin/users",
    icon: <Users className="size-4" />,
  },
  {
    title: "Categorias",
    url: "/admin/categories",
    icon: <FolderClosed className="size-4" />,
  },
  {
    title: "Produtos",
    url: "/admin/products",
    icon: <Shirt className="size-4" />,
  },
  {
    title: "Pedidos",
    url: "/admin/orders",
    icon: <Package className="size-4" />,
  },
  {
    title: "Reviews",
    url: "/admin/reviews",
    icon: <MessageCircleMore className="size-4" />,
  },
];

export const AdminSidebar = async () => {
  const { session, user } = await requireAdmin();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {session ? (
          <div className="flex items-center">
            <Avatar>
              <Avatar>
                <AvatarImage
                  src={user?.image || "/images/user-placeholder.jpg"}
                  alt={user?.name || "User avatar"}
                  className="grayscale"
                />
              </Avatar>{" "}
            </Avatar>
            <span className="ml-2 font-medium">Olá, {user?.name}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Skeleton className="rounded-full size-8" />
            <Skeleton className="ml-2 h-4 w-16" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarNav />
      </SidebarFooter>
    </Sidebar>
  );
};
