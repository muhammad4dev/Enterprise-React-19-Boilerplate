import { Box } from "@mui/material";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";

export const PublicLayout: React.FC = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools initialIsOpen={false} />
    </Box>
  );
};
