import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

import { appRoute } from "@/app/router/layouts";
import { RouteGuard } from "@/app/router/routeGuard";

// Search validation schema
const usersSearchSchema = z.object({
  role: z.string().optional(),
});

// Users List Route
// Path: /app/users
const usersListRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "users",
  validateSearch: usersSearchSchema,
  component: lazyRouteComponent(() =>
    import("./pages/UsersListPage").then((m) => ({ default: m.UsersListPage })),
  ),
  beforeLoad: ({ params }) =>
    RouteGuard({ roles: ["USER", "ADMIN", "MANAGER"] }, params),
});

// User Profile Route
// Path: /app/users/$userId
const userProfileRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "users/$userId",
  component: lazyRouteComponent(() =>
    import("./pages/UserProfilePage").then((m) => ({
      default: m.UserProfilePage,
    })),
  ),
  beforeLoad: ({ params }) =>
    RouteGuard({ roles: ["USER", "ADMIN", "MANAGER"] }, params),
});

export const usersRoutes = [usersListRoute, userProfileRoute] as const;
