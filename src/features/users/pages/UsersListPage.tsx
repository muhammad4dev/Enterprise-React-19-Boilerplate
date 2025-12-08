import { Person as PersonIcon } from "@mui/icons-material";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import { useSearch } from "@tanstack/react-router";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { useAppNavigate } from "@/shared/hooks/useAppNavigate";

// Mock Data
const MOCK_USERS = [
  { id: "1", name: "Alice Johnson", role: "ADMIN", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", role: "USER", email: "bob@example.com" },
  {
    id: "3",
    name: "Charlie Brown",
    role: "USER",
    email: "charlie@example.com",
  },
  {
    id: "4",
    name: "Diana Prince",
    role: "MANAGER",
    email: "diana@example.com",
  },
  {
    id: "5",
    name: "Eve Wilson",
    role: "USER",
    email: "eve@example.com",
  },
  {
    id: "6",
    name: "Frank Davis",
    role: "MANAGER",
    email: "frank@example.com",
  },
  {
    id: "7",
    name: "Grace Johnson",
    role: "USER",
    email: "grace@example.com",
  },
  {
    id: "8",
    name: "Hank Williams",
    role: "ADMIN",
    email: "hank@example.com",
  },
];

export const UsersListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  const search = useSearch({ from: "/$lang/app/users" }) as { role?: string }; // We'll define this route ID in usersRoutes.ts

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    navigate({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        role: event.target.value || undefined,
      }),
    });
  };

  const filteredUsers = React.useMemo(() => {
    if (!search.role) return MOCK_USERS;
    return MOCK_USERS.filter((user) => user.role === search.role);
  }, [search.role]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t("users.title", "User Directory")}
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("common.filters", "Filters")}
          </Typography>
          <TextField
            select
            label={t("users.role", "Role")}
            value={search.role || ""}
            onChange={handleRoleChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">{t("common.all", "All")}</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
          </TextField>
        </Paper>

        <List>
          {filteredUsers.map((user) => (
            <Paper key={user.id} sx={{ mb: 2 }}>
              <ListItem
                secondaryAction={
                  <>
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === "ADMIN" ? "primary" : "default"}
                    />
                    <Button
                      variant="outlined"
                      onClick={() =>
                        navigate({
                          to: "/$lang/app/users/$userId",
                          params: { userId: user.id },
                        })
                      }
                    >
                      {t("common.view", "View")}
                    </Button>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            </Paper>
          ))}
          {filteredUsers.length === 0 && (
            <Typography color="text.secondary" align="center">
              {t("common.noResults", "No users found matching filters.")}
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};
