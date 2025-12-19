import {
  Notifications as NotificationsIcon,
  DeleteSweep as ClearIcon,
  DoneAll as MarkReadIcon,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useMarkNotificationAsRead,
  useClearNotificationHistory,
} from "@/lib/api/mutations";
import { useNotifications } from "@/lib/api/queries";

export function NotificationCenter() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { notifications } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const clearHistory = useClearNotificationHistory();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markAsRead.mutate(n.id);
    });
  };

  const handleClearAll = () => {
    clearHistory.mutate();
    handleClose();
  };

  return (
    <>
      <Tooltip title={t("notifications.title") || "Notifications"}>
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {t("notifications.recent") || "Recent"}
          </Typography>
          <Box>
            <Tooltip title={t("notifications.markAllRead") || "Mark all read"}>
              <IconButton
                size="small"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <MarkReadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("notifications.clearAll") || "Clear all"}>
              <IconButton
                size="small"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider />
        <List sx={{ py: 0 }}>
          {notifications.length === 0 ? (
            <MenuItem disabled>
              <ListItemText
                primary={t("notifications.empty") || "No notifications"}
              />
            </MenuItem>
          ) : (
            notifications.map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => {
                  if (!notif.read) markAsRead.mutate(notif.id);
                }}
                sx={{
                  backgroundColor: notif.read ? "transparent" : "action.hover",
                  whiteSpace: "normal",
                  py: 1,
                }}
              >
                <ListItemText
                  primary={notif.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: "block" }}
                      >
                        {notif.message}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </Typography>
                    </>
                  }
                />
              </MenuItem>
            ))
          )}
        </List>
      </Menu>
    </>
  );
}
