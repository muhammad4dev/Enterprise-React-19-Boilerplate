import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import React, { useLayoutEffect } from "react";

import { usePreferencesStore } from "@/stores/preferencesStore";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { direction, themeMode } = usePreferencesStore();

  useLayoutEffect(() => {
    document.dir = direction;
  }, [direction]);

  const theme = React.useMemo(
    () =>
      createTheme({
        direction,
        palette: {
          mode: themeMode,
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#9c27b0",
          },
        },
        typography: {
          fontFamily:
            direction === "rtl"
              ? '"IBM Plex Sans Arabic", "Roboto", "Helvetica", "Arial", sans-serif'
              : '"Roboto", "Helvetica", "Arial", sans-serif',
        },
      }),
    [direction, themeMode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
