import { useEffect, useCallback } from "react";

import {
  useNotifications,
  type NotificationHistoryItem,
} from "@/lib/api/queries";
import { useSSE } from "@/shared/hooks/useSSE";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/notificationStore";

/**
 * Headless component that listens to SSE and dispatches to the store.
 * Also handles system-level notifications.
 */
export function NotificationManager() {
  const { addNotification } = useNotificationStore();
  const { addLocalNotification } = useNotifications();

  const urlBase64ToUint8Array = useCallback((base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }, []);

  const registerPush = useCallback(
    async (retry = true) => {
      const doRegister = async (shouldRetry: boolean) => {
        try {
          const registration = await navigator.serviceWorker.ready;

          // The public key generated from our script
          const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";
          const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

          // Check for existing subscription
          const existingSubscription =
            await registration.pushManager.getSubscription();

          if (existingSubscription) {
            // If keys don't match or other issues, we might need to unsubscribe
            // We can't easily compare keys directly, so if we're here and it fails later, we'll unsubscribe
            console.warn("Existing push subscription found");
          }

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });

          console.warn("Push Subscription successful:", subscription);

          // Send the subscription to our new push server
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscribe`, {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.warn("Subscription sent to backend");
        } catch (error) {
          if (
            shouldRetry &&
            error instanceof DOMException &&
            error.name === "InvalidStateError"
          ) {
            console.warn(
              "Push registration failed with InvalidStateError. Unsubscribing and retrying...",
            );
            const registration = await navigator.serviceWorker.ready;
            const subscription =
              await registration.pushManager.getSubscription();
            if (subscription) {
              await subscription.unsubscribe();
            }
            await doRegister(false);
          } else {
            console.error("Push registration failed:", error);
          }
        }
      };

      await doRegister(retry);
    },
    [urlBase64ToUint8Array],
  );

  // Request permission on mount
  useEffect(() => {
    const subscribeToPush = async () => {
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            registerPush();
          }
        } else if (Notification.permission === "granted") {
          registerPush();
        }
      }
    };

    subscribeToPush();
  }, [registerPush]);

  // Handle messages from Service Worker (Push Notifications)
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "PUSH_RECEIVED") {
        const payload = event.data.payload as NotificationHistoryItem;

        // 1. Show Toast (Zustand)
        addNotification({
          title: payload.title,
          message: payload.message,
          type: "info",
        });

        // 2. Add to History (React Query)
        addLocalNotification(payload);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () =>
      navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, [addNotification, addLocalNotification]);

  // SSE Listener for in-app notifications
  const sseUrl = import.meta.env.VITE_SSE_URL || "";

  const handleSSEMessage = useCallback(
    (data: Omit<Notification, "id">) => {
      const id = Date.now().toString();
      const notification: NotificationHistoryItem = {
        id,
        title: data.title,
        message: data.message,
        url: "/",
        timestamp: new Date().toISOString(),
      };

      // 1. Show Toast (Zustand)
      addNotification(data);

      // 2. Add to History (React Query)
      addLocalNotification(notification);

      // 3. System Notification
      const showSystemNotification = async () => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
          new Notification(data.title, {
            body: data.message,
            icon: "/pwa-192x192.png",
            tag: "system-notification-" + id,
          });
        }
      };

      showSystemNotification();
    },
    [addNotification, addLocalNotification],
  );

  useSSE<Omit<Notification, "id">>(sseUrl, {
    onMessage: handleSSEMessage,
  });

  return null;
}
