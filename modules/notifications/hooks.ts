import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import type { RouterOutput } from "@/trpc/routers/_app";
import type { NotificationsOutput } from "@/modules/notifications/types";

type UnreadCountOutput = RouterOutput["notifications"]["getUnreadCount"];

type MutationContext = {
  previousNotificationLists: Array<
    [readonly unknown[], NotificationsOutput | undefined]
  >;
  previousUnreadCounts: Array<
    [readonly unknown[], UnreadCountOutput | undefined]
  >;
};

const restoreMutationContext = (
  queryClient: QueryClient,
  context?: MutationContext,
) => {
  if (!context) return;

  for (const [queryKey, data] of context.previousNotificationLists) {
    queryClient.setQueryData(queryKey, data);
  }

  for (const [queryKey, data] of context.previousUnreadCounts) {
    queryClient.setQueryData(queryKey, data);
  }
};

/**
 * Hook to fetch all notifications for the current user.
 */
export const useGetNotifications = () => {
  const trpc = useTRPC();
  return useQuery(trpc.notifications.list.queryOptions());
};

/**
 * Hook to fetch just the unread count (perfect for a bell icon badge).
 */
export const useGetUnreadCount = () => {
  const trpc = useTRPC();
  return useQuery(trpc.notifications.getUnreadCount.queryOptions());
};

/**
 * Hook to mark a single notification as read.
 */
export const useMarkAsRead = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const listFilter = trpc.notifications.list.pathFilter();
  const unreadCountFilter = trpc.notifications.getUnreadCount.pathFilter();

  return useMutation(
    trpc.notifications.markAsRead.mutationOptions({
      onMutate: async (variables): Promise<MutationContext> => {
        await Promise.all([
          queryClient.cancelQueries(listFilter),
          queryClient.cancelQueries(unreadCountFilter),
        ]);

        const previousNotificationLists =
          queryClient.getQueriesData<NotificationsOutput>(listFilter);

        const previousUnreadCounts =
          queryClient.getQueriesData<UnreadCountOutput>(unreadCountFilter);

        const shouldDecrementUnread = previousNotificationLists.some(
          ([, list]) =>
            list?.some(
              (notification) =>
                notification.id === variables.id && !notification.isRead,
            ) ?? false,
        );

        queryClient.setQueriesData<NotificationsOutput>(listFilter, (old) => {
          if (!old) return old;

          return old.map((notification) =>
            notification.id === variables.id
              ? { ...notification, isRead: true }
              : notification,
          );
        });

        if (shouldDecrementUnread) {
          queryClient.setQueriesData<UnreadCountOutput>(
            unreadCountFilter,
            (old) => {
              if (typeof old !== "number") return old;
              return Math.max(0, old - 1);
            },
          );
        }

        return {
          previousNotificationLists,
          previousUnreadCounts,
        };
      },

      onError: (_error, _variables, onMutateResult) => {
        restoreMutationContext(queryClient, onMutateResult);
      },

      onSettled: async () => {
        await Promise.all([
          queryClient.invalidateQueries(listFilter),
          queryClient.invalidateQueries(unreadCountFilter),
        ]);
      },
    }),
  );
};

/**
 * Hook to mark all notifications as read at once.
 */
export const useMarkAllAsRead = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const listFilter = trpc.notifications.list.pathFilter();
  const unreadCountFilter = trpc.notifications.getUnreadCount.pathFilter();

  return useMutation(
    trpc.notifications.markAllAsRead.mutationOptions({
      onMutate: async (): Promise<MutationContext> => {
        await Promise.all([
          queryClient.cancelQueries(listFilter),
          queryClient.cancelQueries(unreadCountFilter),
        ]);

        const previousNotificationLists =
          queryClient.getQueriesData<NotificationsOutput>(listFilter);

        const previousUnreadCounts =
          queryClient.getQueriesData<UnreadCountOutput>(unreadCountFilter);

        queryClient.setQueriesData<NotificationsOutput>(listFilter, (old) => {
          if (!old) return old;

          return old.map((notification) => ({
            ...notification,
            isRead: true,
          }));
        });

        queryClient.setQueriesData<UnreadCountOutput>(
          unreadCountFilter,
          (old) => {
            if (typeof old !== "number") return old;
            return 0;
          },
        );

        return {
          previousNotificationLists,
          previousUnreadCounts,
        };
      },

      onError: (_error, _variables, onMutateResult) => {
        restoreMutationContext(queryClient, onMutateResult);
      },

      onSettled: async () => {
        await Promise.all([
          queryClient.invalidateQueries(listFilter),
          queryClient.invalidateQueries(unreadCountFilter),
        ]);
      },
    }),
  );
};

/**
 * Hook to delete multiple notifications.
 */
export const useDeleteNotifications = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const listFilter = trpc.notifications.list.pathFilter();
  const unreadCountFilter = trpc.notifications.getUnreadCount.pathFilter();

  return useMutation(
    trpc.notifications.deleteMany.mutationOptions({
      onMutate: async (variables): Promise<MutationContext> => {
        await Promise.all([
          queryClient.cancelQueries(listFilter),
          queryClient.cancelQueries(unreadCountFilter),
        ]);

        const previousNotificationLists =
          queryClient.getQueriesData<NotificationsOutput>(listFilter);

        const previousUnreadCounts =
          queryClient.getQueriesData<UnreadCountOutput>(unreadCountFilter);

        const idsToDelete = new Set(variables.ids);
        const unreadDeletedIds = new Set<string>();

        for (const [, list] of previousNotificationLists) {
          if (!list) continue;

          for (const notification of list) {
            if (idsToDelete.has(notification.id) && !notification.isRead) {
              unreadDeletedIds.add(notification.id);
            }
          }
        }

        queryClient.setQueriesData<NotificationsOutput>(listFilter, (old) => {
          if (!old) return old;

          return old.filter(
            (notification) => !idsToDelete.has(notification.id),
          );
        });

        if (unreadDeletedIds.size > 0) {
          queryClient.setQueriesData<UnreadCountOutput>(
            unreadCountFilter,
            (old) => {
              if (typeof old !== "number") return old;
              return Math.max(0, old - unreadDeletedIds.size);
            },
          );
        }

        return {
          previousNotificationLists,
          previousUnreadCounts,
        };
      },

      onError: (_error, _variables, onMutateResult) => {
        restoreMutationContext(queryClient, onMutateResult);
      },

      onSettled: async () => {
        await Promise.all([
          queryClient.invalidateQueries(listFilter),
          queryClient.invalidateQueries(unreadCountFilter),
        ]);
      },
    }),
  );
};
