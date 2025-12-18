import { create } from "zustand";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "error";
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newNotification = { ...notification, id };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 10), // Keep max 10
    }));

    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
