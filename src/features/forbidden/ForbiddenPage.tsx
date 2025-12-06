import { Lock } from "@mui/icons-material";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { ROUTES } from "@/config/constants";
import { useAppNavigate } from "@/shared/hooks/useAppNavigate";

export const ForbiddenPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Lock sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            {t("forbidden.title")}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t("forbidden.message")}
          </Typography>
          <Button
            variant="contained"
            onClick={() =>
              navigate({
                to: ROUTES.DASHBOARD,
              })
            }
            sx={{ mt: 2 }}
          >
            {t("forbidden.goToDashboard")}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};
