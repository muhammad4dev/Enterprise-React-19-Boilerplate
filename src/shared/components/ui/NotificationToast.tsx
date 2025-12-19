import { Alert, AlertTitle, Box, Stack } from "@mui/material";

import { useNotificationStore } from "@/stores/notificationStore";

/**
 * Displays notifications from the global store using MUI Alerts.
 * Stackable bottom-right toast notifications.
 */
export function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 24,
        left: 0,
        right: 0,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none", // Allow clicks to pass through empty space
        gap: 1,
      }}
    >
      <Stack
        spacing={1}
        direction="column"
        sx={{
          width: "100%",
          maxWidth: 400,
          pointerEvents: "auto", // Re-enable clicks on the alerts
        }}
      >
        {notifications.map((notif) => (
          <Alert
            key={notif.id}
            severity={notif.type || "info"}
            onClose={() => removeNotification(notif.id)}
            sx={{ width: "100%", marginTop: 1, boxShadow: 3 }}
            elevation={6}
            variant="filled"
          >
            <AlertTitle>{notif.title}</AlertTitle>
            {notif.message}
          </Alert>
        ))}
      </Stack>
    </Box>
  );
}
