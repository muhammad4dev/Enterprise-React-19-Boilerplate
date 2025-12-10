import { Container, Typography, Paper, Box, Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { IfAllowed } from "@/lib/rbac/components";

export const AdminPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("nav.admin")}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Admin Panel
        </Typography>

        <Typography paragraph>
          This page is only accessible to users with the ADMIN role.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <IfAllowed
            permissions={["manage:users"]}
            fallback={
              <Typography color="text.secondary" variant="body2">
                You don&apos;t have permission to manage users.
              </Typography>
            }
          >
            <Button variant="contained" color="primary">
              Manage Users
            </Button>
          </IfAllowed>
        </Box>
      </Paper>
    </Container>
  );
};
