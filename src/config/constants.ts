import type { SupportedLanguage } from "@/lib/i18n/config";

export const APP_CONFIG = {
  name: "Enterprise React App",
  defaultLanguage:
    (localStorage.getItem("app_locale") as SupportedLanguage) ||
    ("en" as SupportedLanguage),
  defaultDirection: "ltr",
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
} as const;

export const STORAGE_KEYS = {
  AUTH: "auth",
  THEME_MODE: "theme_mode",
  LOCALE: "app_locale",
} as const;

export const ROUTES = {
  ROOT: "/",
  APP: "/$lang/app",
  LOGIN: "/$lang/login",
  DASHBOARD: "/$lang/app/dashboard",
  FORBIDDEN: "/$lang/forbidden",
} as const;
