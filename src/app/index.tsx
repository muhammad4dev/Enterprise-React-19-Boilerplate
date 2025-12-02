import { Box, CircularProgress } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import { queryClient } from "@/lib/api/query-client";
import i18n from "@/lib/i18n/config";

import { ThemeProvider } from "./providers/ThemeProvider";
import { router } from "./router";

// Loading fallback for lazy-loaded routes
const RouteLoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Suspense fallback={<RouteLoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
