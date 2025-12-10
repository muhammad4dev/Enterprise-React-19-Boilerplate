import { Navigate, useLocation } from "@tanstack/react-router";
import React from "react";

import { ROUTES } from "@/config/constants";
import { useAuthStore } from "@/stores/authStore";

import { canAccess } from "./guards";
import type { UserRole, Permission } from "./types";

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Wrapper that enforces authentication.
 * Redirects to login if user is not authenticated.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  redirectTo = ROUTES.LOGIN,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // @ts-expect-error - redirect search param is not in schema but needed for return navigation
    return <Navigate to={redirectTo} search={{ redirect: location.href }} />;
  }

  return <>{children}</>;
};

interface IfAllowedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  roles?: UserRole[];
  permissions?: Permission[];
}

/**
 * Conditionally renders children based on RBAC check.
 * Use this to hide/show UI elements.
 */
export const IfAllowed: React.FC<IfAllowedProps> = ({
  children,
  fallback = null,
  roles,
  permissions,
}) => {
  const { user } = useAuthStore();

  const allowed = canAccess(user, {
    allowedRoles: roles,
    requiredPermissions: permissions,
  });

  return allowed ? <>{children}</> : <>{fallback}</>;
};
