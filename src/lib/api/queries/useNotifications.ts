import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import { queryKeys } from "../query-keys";

export interface NotificationHistoryItem {
  id: string;
  title: string;
  message: string;
  url: string;
  timestamp: string;
  read?: boolean;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/notifications`;

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery<NotificationHistoryItem[]>({
    queryKey: queryKeys.notifications.all,
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addLocalNotification = useCallback(
    (notification: NotificationHistoryItem) => {
      queryClient.setQueryData<NotificationHistoryItem[]>(
        queryKeys.notifications.all,
        (oldData) => {
          if (!oldData) return [notification];
          if (oldData.some((item) => item.id === notification.id))
            return oldData;
          return [notification, ...oldData].slice(0, 50);
        }
      );
    },
    [queryClient]
  );

  return {
    ...query,
    notifications: query.data || [],
    addLocalNotification,
  };
};
