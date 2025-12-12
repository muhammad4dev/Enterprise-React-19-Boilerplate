import { Button, Snackbar, Alert } from "@mui/material";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from "virtual:pwa-register/react";

import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import { usePageVisibility } from "@/shared/hooks/usePageVisibility";

/**
 * PWA Update Prompt Component
 * Shows a snackbar notification when a new version of the app is available.
 * Uses MUI components for a polished, theme-consistent UI.
 */
export const PWAUpdatePrompt: React.FC = () => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const location = useLocation();
  const lastCheckRef = useRef<number>(0);
  const { isOnline } = useNetworkStatus();
  const isVisible = usePageVisibility();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.warn("SW Registered:", r);
      setRegistration(r || null);
    },
    onRegisterError(error) {
      console.error("SW registration error:", error);
    },
  });

  // Check logic
  const checkUpdate = useRef<(source: string) => void>(() => {});

  useEffect(() => {
    if (!registration) return;

    checkUpdate.current = async (source: string) => {
      const now = Date.now();
      // Throttle checks to once every 5 minutes (300000ms)
      // Exception: Immediate check on mount (lastCheckRef is 0) or explicit 'online' event
      if (
        now - lastCheckRef.current > 5 * 60 * 1000 ||
        lastCheckRef.current === 0 ||
        source === "online"
      ) {
        try {
          await registration.update();
          lastCheckRef.current = now;
        } catch (err) {
          console.warn(`Failed to check for SW update (${source}):`, err);
        }
      }
    };
  }, [registration]);

  // Network recovery check
  useEffect(() => {
    if (isOnline && registration) {
      checkUpdate.current("online");
    }
  }, [isOnline, registration]);

  // Visibility check
  useEffect(() => {
    if (isVisible && registration) {
      checkUpdate.current("visibility change");
    }
  }, [isVisible, registration]);

  // Route change and interval checks
  useEffect(() => {
    if (!registration) return;

    // Check on route change
    checkUpdate.current("route change");

    // Check every hour
    const interval = setInterval(
      () => {
        registration.update().catch((err) => {
          console.warn("Failed to check for SW update (interval):", err);
        });
        lastCheckRef.current = Date.now();
      },
      60 * 60 * 1000,
    );

    return () => {
      clearInterval(interval);
    };
  }, [registration, location.pathname]);

  const handleClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  return (
    <>
      {/* Offline Ready Notification */}
      <Snackbar
        open={offlineReady}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          App ready to work offline
        </Alert>
      </Snackbar>

      {/* Update Available Notification */}
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: 2 }}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{ width: "100%", alignItems: "center" }}
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={handleClose}
                sx={{ mr: 1 }}
              >
                Later
              </Button>
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                onClick={handleUpdate}
                sx={{ fontWeight: "bold" }}
              >
                Refresh
              </Button>
            </>
          }
        >
          New version available!
        </Alert>
      </Snackbar>
    </>
  );
};
