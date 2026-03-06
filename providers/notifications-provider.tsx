"use client";

import { RealtimeProvider } from "@upstash/realtime/client";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RealtimeProvider>{children}</RealtimeProvider>;
}
