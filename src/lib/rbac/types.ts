export type UserRole = "GUEST" | "USER" | "MANAGER" | "ADMIN";

export type Permission =
  | "view:dashboard"
  | "view:admin"
  | "manage:users"
  | "manage:settings";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  token: string;
}

export interface RBACMeta {
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
}
