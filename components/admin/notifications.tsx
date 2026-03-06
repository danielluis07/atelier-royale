"use client";

import { Bell, Trash2, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRealtime } from "@upstash/realtime/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export const Notifications = () => {
  const [notifications, setNotifications] = useState<
    { message: string; date: string; id: string; orderId: string }[]
  >([]);

  useRealtime({
    events: ["notification.created"],
    onData({ data }) {
      const newNotification = {
        ...data,
        id: `${Date.now()}-${Math.random()}`,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
  });

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white shadow-sm">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold text-sm">Notificações</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="h-7 text-xs text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Limpar tudo
            </Button>
          )}
        </div>
        <div className="max-h-100 overflow-y-auto">
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
                  className="group relative px-4 py-3 hover:bg-accent/50 transition-colors">
                  <Link
                    href={`/admin/orders/${notification.orderId}`}
                    className="flex gap-3 pr-8">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-snug">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.date), "HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => deleteNotification(notification.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
