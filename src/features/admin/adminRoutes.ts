import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appRoute } from "@/app/router/layouts";
import { RouteGuard } from "@/app/router/routeGuard";

const adminRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "admin",
  component: lazyRouteComponent(() =>
    import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })),
  ),
  beforeLoad: ({ params }) => RouteGuard({ roles: ["ADMIN"] }, params),
});

export const adminRoutes = [adminRoute] as const;
