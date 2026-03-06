"use client";

import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRealtime } from "@upstash/realtime/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  useDeleteNotifications,
  useGetNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
} from "@/modules/notifications/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Notifications = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { data: notifications = [] } = useGetNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const { mutate: deleteNotifications } = useDeleteNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  useRealtime({
    events: ["notification.created"],
    onData() {
      queryClient.invalidateQueries(trpc.notifications.list.pathFilter());
    },
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    deleteNotifications({ ids: [id] });
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    const allIds = notifications.map((n) => n.id);
    deleteNotifications({ ids: allIds });
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Button
          aria-label="Abrir notificações"
          onClick={() => setOpen((prev) => !prev)}
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent transition-colors">
          <Bell className="size-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-white shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverAnchor>

      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold text-sm">Notificações</h3>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-7 text-xs text-muted-foreground hover:text-blue-600">
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Lidas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 text-xs text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-100">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Sem notificações
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Você está em dia!
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`group relative px-4 py-3 transition-colors ${
                    notification.isRead
                      ? "hover:bg-accent/50 opacity-75"
                      : "bg-blue-50/40 hover:bg-blue-50/60"
                  }`}>
                  <Link
                    href={notification.actionUrl || "#"}
                    onClick={() => {
                      if (!notification.isRead)
                        markAsRead({ id: notification.id });
                      setOpen(false);
                    }}
                    className="flex gap-3 pr-8">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm leading-snug text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        {format(
                          new Date(notification.createdAt),
                          "HH:mm - dd/MM",
                          {
                            locale: ptBR,
                          },
                        )}
                      </p>
                    </div>
                  </Link>

                  <Button
                    aria-label={`Excluir notificação ${notification.title}`}
                    variant="ghost"
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="absolute top-3 right-3 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 hover:bg-destructive/10 hover:text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
