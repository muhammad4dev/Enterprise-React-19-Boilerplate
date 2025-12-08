import { ArrowBack } from "@mui/icons-material";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import { useParams } from "@tanstack/react-router";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { useAppNavigate } from "@/shared/hooks/useAppNavigate";

// Mock Data (ideally fetched from API)
const MOCK_USER_DETAILS = {
  "1": {
    id: "1",
    name: "Alice Johnson",
    role: "ADMIN",
    email: "alice@example.com",
    bio: "System Administrator",
    joinDate: "2023-01-15",
  },
  "2": {
    id: "2",
    name: "Bob Smith",
    role: "USER",
    email: "bob@example.com",
    bio: "Frontend Developer",
    joinDate: "2023-03-20",
  },
  "3": {
    id: "3",
    name: "Charlie Brown",
    role: "USER",
    email: "charlie@example.com",
    bio: "Designer",
    joinDate: "2023-04-10",
  },
  "4": {
    id: "4",
    name: "Diana Prince",
    role: "MANAGER",
    email: "diana@example.com",
    bio: "Project Manager",
    joinDate: "2022-11-05",
  },
};

export const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  const { userId } = useParams({ from: "/$lang/app/users/$userId" });

  const user = MOCK_USER_DETAILS[userId as keyof typeof MOCK_USER_DETAILS];

  if (!user) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            User not found
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate({ to: "/$lang/app/users" })}
            sx={{ mt: 2 }}
          >
            Back to User Directory
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate({ to: "/$lang/app/users" })}
        sx={{ mb: 3 }}
      >
        {t("common.back", "Back")}
      </Button>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              {user.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <Chip label={user.role} color="primary" />
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Profile Details
            </Typography>
            <Box sx={{ display: "grid", gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  User ID
                </Typography>
                <Typography>{user.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Joined
                </Typography>
                <Typography>{user.joinDate}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Bio
            </Typography>
            <Typography variant="body1">{user.bio}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
