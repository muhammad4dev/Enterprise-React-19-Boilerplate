import { WifiOff, Wifi } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";

import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

/**
 * Network Status Notification Component
 * Shows a snackbar notification when the user goes offline or comes back online.
 * Uses the useNetworkStatus hook for logic.
 */
export const NetworkStatus: React.FC = () => {
  const { isOnline, showOffline, showBackOnline, setShowBackOnline } =
    useNetworkStatus();

  return (
    <>
      {/* Offline Notification - Persistent until back online */}
      <Snackbar
        open={showOffline && !isOnline}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          icon={<WifiOff />}
          sx={{ width: "100%", alignItems: "center" }}
        >
          You are offline. Some features may be unavailable.
        </Alert>
      </Snackbar>

      {/* Back Online Notification - Auto-dismiss */}
      <Snackbar
        open={showBackOnline}
        autoHideDuration={4000}
        onClose={() => setShowBackOnline(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowBackOnline(false)}
          severity="success"
          variant="filled"
          icon={<Wifi />}
          sx={{ width: "100%" }}
        >
          You are back online!
        </Alert>
      </Snackbar>
    </>
  );
};
