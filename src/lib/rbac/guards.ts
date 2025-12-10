import type { AuthUser, RBACMeta, UserRole, Permission } from "./types";

/**
 * Checks if a user has a specific role.
 */
export const hasRole = (user: AuthUser | null, role: UserRole): boolean => {
  if (!user) return false;
  if (user.role === "ADMIN") return true; // Admin has Access to everything by role

  // Hierarchy check could go here if needed
  return user.role === role;
};

/**
 * Checks if a user has a specific permission.
 */
export const hasPermission = (
  user: AuthUser | null,
  permission: Permission,
): boolean => {
  if (!user) return false;
  if (user.role === "ADMIN") return true; // Admin has all permissions

  return user.permissions.includes(permission);
};

/**
 * Checks if a user has ANY of the required roles.
 */
export const checkRoles = (
  user: AuthUser | null,
  allowedRoles?: UserRole[],
): boolean => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!user) return false;

  return allowedRoles.some((role) => hasRole(user, role));
};

/**
 * Checks if a user has ALL of the required permissions.
 */
export const checkPermissions = (
  user: AuthUser | null,
  requiredPermissions?: Permission[],
): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!user) return false;

  return requiredPermissions.every((permission) =>
    hasPermission(user, permission),
  );
};

/**
 * Main access evaluation function.
 * Checks authentication, roles, and permissions against route/component metadata.
 */
export const canAccess = (user: AuthUser | null, meta?: RBACMeta): boolean => {
  if (!meta) return true;

  // 1. Check Authentication
  if (meta.requiresAuth && !user?.token) {
    return false;
  }

  // 2. Check Roles
  if (meta.allowedRoles && !checkRoles(user, meta.allowedRoles)) {
    return false;
  }

  // 3. Check Permissions
  if (
    meta.requiredPermissions &&
    !checkPermissions(user, meta.requiredPermissions)
  ) {
    return false;
  }

  return true;
};
