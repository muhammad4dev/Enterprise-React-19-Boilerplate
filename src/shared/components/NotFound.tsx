import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ROUTES } from "@/config/constants";
import { useAppNavigate } from "@/shared/hooks/useAppNavigate";

export const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useAppNavigate();

  const handleGoHome = () => {
    navigate({
      to: ROUTES.DASHBOARD,
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <ErrorIcon sx={{ fontSize: 100, color: "error.main" }} />

        <Typography variant="h2" component="h1" fontWeight="bold">
          404
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          {t("notFound.title")}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {t("notFound.message")}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          sx={{ mt: 2 }}
        >
          {t("notFound.goToDashboard")}
        </Button>
      </Box>
    </Container>
  );
};
