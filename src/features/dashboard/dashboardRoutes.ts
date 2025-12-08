// Import your page components
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appRoute } from "@/app/router/layouts";
import { RouteGuard } from "@/app/router/routeGuard";

// Dashboard - accessible to all authenticated users
const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "dashboard",
  component: lazyRouteComponent(() =>
    import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
  ),
  beforeLoad: ({ params }) => RouteGuard({ roles: ["USER"] }, params),
});

export const dashboardRoutes = [dashboardRoute] as const;
