import { adminRoutes } from "@/features/admin/adminRoutes";
import { dashboardRoutes } from "@/features/dashboard/dashboardRoutes";
import { usersRoutes } from "@/features/users/usersRoutes";

export const appRoutes = [
  ...dashboardRoutes,
  ...adminRoutes,
  ...usersRoutes,
] as const;
