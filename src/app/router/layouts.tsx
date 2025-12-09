import {
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { APP_CONFIG } from "@/config/constants";
import i18n, {
  supportedLanguages,
  type SupportedLanguage,
} from "@/lib/i18n/config";
import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { PublicLayout } from "@/shared/components/layouts/PublicLayout";
import { NetworkStatus } from "@/shared/components/ui/NetworkStatus";
import { PWAUpdatePrompt } from "@/shared/components/ui/PWAUpdatePrompt";

import { RouteGuard } from "./routeGuard";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <NetworkStatus />
      <PWAUpdatePrompt />
    </>
  ),
});

// Language Wrapper Route
// VALIDATES the 'lang' param. If invalid, redirects to default 'en'.
export const langRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$lang",
  component: Outlet,
  params: {
    parse: (params) => ({ lang: params.lang as SupportedLanguage }),
    stringify: (params) => ({ lang: params.lang }),
  },
  beforeLoad: ({ params, location }) => {
    const lang = params.lang;
    if (!supportedLanguages.includes(lang)) {
      // If the language param is invalid, we assume the user omitted the language
      // and is trying to access a route directly (e.g. /app/dashboard).
      // We redirect to the default language version of the current path.
      throw redirect({
        // @ts-expect-error - Dynamic redirect path fallback
        to: `/${APP_CONFIG.defaultLanguage}${location.pathname}`,
        replace: true,
      });
    }

    // Sync i18n with URL param
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  },
});

export const publicRoute = createRoute({
  getParentRoute: () => langRoute,
  id: "public",
  component: PublicLayout,
});

export const appRoute = createRoute({
  getParentRoute: () => langRoute,
  path: "/app", // This becomes /:lang/app
  component: AppLayout,
  beforeLoad: ({ params }) => RouteGuard({ requiresAuth: true }, params),
});
