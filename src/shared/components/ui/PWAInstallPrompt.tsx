import { GetApp as InstallIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  Snackbar,
  Alert,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Event interface for the beforeinstallprompt event
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend the WindowEventMap to include the beforeinstallprompt event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const DISMISS_STORAGE_KEY = "pwa-install-dismissed";
const DISMISS_DURATION_DAYS = 7;

/**
 * PWA Install Prompt Component
 * Shows a snackbar notification prompting users to install the app.
 * The prompt is automatically triggered by the browser when the app
 * meets PWA installability criteria.
 */
export const PWAInstallPrompt: React.FC = () => {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  // Use lazy initialization to check if app is already installed (standalone mode)
  // This avoids calling setState in useEffect which causes cascading renders
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - iOS Safari specific property
      window.navigator.standalone === true
    );
  });

  // Check if the prompt was recently dismissed
  const isDismissed = useCallback(() => {
    const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!dismissedAt) return false;

    const dismissedTime = parseInt(dismissedAt, 10);
    const now = Date.now();
    const daysElapsed = (now - dismissedTime) / (1000 * 60 * 60 * 24);

    return daysElapsed < DISMISS_DURATION_DAYS;
  }, []);

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    if (isInstalled) return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e);

      // Show the prompt if not already dismissed
      if (!isDismissed()) {
        // Delay showing the prompt slightly for better UX
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setInstallPrompt(null);
      localStorage.removeItem(DISMISS_STORAGE_KEY);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled, isDismissed]);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      // Show the install prompt
      await installPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        console.warn("User accepted the PWA install prompt");
      } else {
        console.warn("User dismissed the PWA install prompt");
        // Mark as dismissed for 7 days
        localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
      }
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }

    // Clear the saved prompt
    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Mark as dismissed for 7 days
    localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
  };

  // Don't render if already installed or no prompt available
  if (isInstalled || !installPrompt) return null;

  return (
    <Snackbar
      open={showPrompt}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ mb: 2 }}
    >
      <Alert
        severity="info"
        variant="filled"
        icon={<InstallIcon />}
        sx={{
          width: "100%",
          alignItems: "center",
          "& .MuiAlert-message": {
            flex: 1,
          },
        }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={handleInstall}
              startIcon={<InstallIcon />}
              sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              {t("pwa.install")}
            </Button>
            <IconButton
              color="inherit"
              size="small"
              onClick={handleDismiss}
              aria-label={t("pwa.dismiss")}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <Typography variant="body2" component="span">
          {t("pwa.installMessage")}
        </Typography>
      </Alert>
    </Snackbar>
  );
};
