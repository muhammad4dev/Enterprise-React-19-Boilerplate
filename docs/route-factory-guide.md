# Declarative Route Configuration Guide

## Overview

The route factory provides a clean, declarative way to define protected routes with automatic RBAC enforcement. Instead of manually creating each route with repetitive `beforeLoad` logic, you can define routes as simple configuration objects.

## Basic Usage

### Simple Route

```typescript
const protectedRoutesConfig: RouteConfig[] = [
  {
    path: "/dashboard",
    component: DashboardPage,
    roles: ["USER", "MANAGER", "ADMIN"],
  },
];
```

### Admin-Only Route

```typescript
{
  path: '/admin',
  component: AdminPage,
  roles: ['ADMIN'],
}
```

### Permission-Based Route

```typescript
{
  path: '/settings',
  component: SettingsPage,
  permissions: ['manage:settings'],
}
```

### Combined Roles and Permissions

```typescript
{
  path: '/reports',
  component: ReportsPage,
  roles: ['MANAGER', 'ADMIN'],
  permissions: ['view:reports'],
}
```

## Nested Routes

You can define nested routes using the `children` property:

```typescript
const protectedRoutesConfig: RouteConfig[] = [
  {
    path: "/admin",
    component: AdminPage,
    roles: ["ADMIN"],
    children: [
      {
        path: "/users",
        component: UsersPage,
        permissions: ["manage:users"],
      },
      {
        path: "/settings",
        component: AdminSettingsPage,
        permissions: ["manage:settings"],
      },
    ],
  },
];
```

This creates:

- `/app/admin` - Requires ADMIN role
- `/app/admin/users` - Requires ADMIN role + `manage:users` permission
- `/app/admin/settings` - Requires ADMIN role + `manage:settings` permission

## Complete Example

```typescript
// src/app/router/router.tsx
import { createProtectedRoutes } from "./routeFactory";
import type { RouteConfig } from "./routeFactory";

// Import your page components
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { AdminPage } from "@/features/admin/pages/AdminPage";
import { UsersPage } from "@/features/admin/pages/UsersPage";
import { ReportsPage } from "@/features/reports/pages/ReportsPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";

// Define all protected routes declaratively
const protectedRoutesConfig: RouteConfig[] = [
  // Dashboard - accessible to all authenticated users
  {
    path: "/dashboard",
    component: DashboardPage,
    roles: ["USER", "MANAGER", "ADMIN"],
  },

  // Reports - managers and admins only
  {
    path: "/reports",
    component: ReportsPage,
    roles: ["MANAGER", "ADMIN"],
  },

  // Settings - requires specific permission
  {
    path: "/settings",
    component: SettingsPage,
    permissions: ["manage:settings"],
  },

  // Admin section with nested routes
  {
    path: "/admin",
    component: AdminPage,
    roles: ["ADMIN"],
    children: [
      {
        path: "/users",
        component: UsersPage,
        permissions: ["manage:users"],
      },
    ],
  },
];

// Create routes using the factory
const protectedRoutes = createProtectedRoutes(protectedRoutesConfig, appRoute);

// Add to route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  publicRoute.addChildren([loginRoute]),
  appRoute.addChildren(protectedRoutes),
  forbiddenRoute,
]);
```

## API Reference

### `RouteConfig` Interface

```typescript
interface RouteConfig {
  path: string; // Route path (e.g., '/dashboard')
  component: RouteComponent; // Page component to render
  roles?: UserRole[]; // Allowed roles (optional)
  permissions?: Permission[]; // Required permissions (optional)
  requiresAuth?: boolean; // Requires authentication (default: true)
  children?: RouteConfig[]; // Nested child routes (optional)
}
```

### `createProtectedRoute(config, parentRoute)`

Creates a single protected route with automatic RBAC checks.

**Parameters:**

- `config: RouteConfig` - Route configuration object
- `parentRoute: AnyRoute` - Parent route (usually `appRoute`)

**Returns:** `AnyRoute` - TanStack Router route

### `createProtectedRoutes(configs, parentRoute)`

Creates multiple protected routes from an array of configurations.

**Parameters:**

- `configs: RouteConfig[]` - Array of route configurations
- `parentRoute: AnyRoute` - Parent route (usually `appRoute`)

**Returns:** `AnyRoute[]` - Array of TanStack Router routes

## How It Works

### Automatic RBAC Enforcement

Every route created with the factory automatically:

1. **Checks authentication** - Redirects to `/login` if not authenticated
2. **Checks roles** - Redirects to `/forbidden` if user lacks required role
3. **Checks permissions** - Redirects to `/forbidden` if user lacks required permissions

### Default Behavior

- `requiresAuth` defaults to `true` for all routes
- If no `roles` or `permissions` are specified, only authentication is required
- RBAC checks use the same `canAccess()` logic as component-level protection

## Benefits

### ✅ DRY (Don't Repeat Yourself)

No more repetitive `beforeLoad` functions - RBAC logic is centralized.

### ✅ Declarative

Routes are defined as simple data structures, making them easy to understand and maintain.

### ✅ Type-Safe

Full TypeScript support with proper type inference.

### ✅ Scalable

Easy to add new routes - just add a new object to the array.

### ✅ Consistent

All routes use the same RBAC logic, reducing bugs.

## Migration from Manual Routes

**Before:**

```typescript
const adminRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin",
  component: AdminPage,
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    const meta: RBACMeta = {
      requiresAuth: true,
      allowedRoles: ["ADMIN"],
    };
    if (!canAccess(user, meta)) {
      throw redirect({ to: "/forbidden" });
    }
  },
});
```

**After:**

```typescript
{
  path: '/admin',
  component: AdminPage,
  roles: ['ADMIN'],
}
```

## Adding New Routes

To add a new protected route:

1. Import the page component
2. Add a new object to `protectedRoutesConfig`
3. Specify `path`, `component`, and optionally `roles` or `permissions`

That's it! The route factory handles the rest.

```typescript
// 1. Import
import { NewFeaturePage } from "@/features/new-feature/pages/NewFeaturePage";

// 2. Add to config
const protectedRoutesConfig: RouteConfig[] = [
  // ... existing routes
  {
    path: "/new-feature",
    component: NewFeaturePage,
    roles: ["USER", "ADMIN"],
    permissions: ["view:new-feature"],
  },
];
```
