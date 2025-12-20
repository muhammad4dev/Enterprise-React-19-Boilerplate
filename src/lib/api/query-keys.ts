export const queryKeys = {
  auth: {
    user: ["auth", "user"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
  },
} as const;

// Type helpers for query data
export type UserListFilters = {
  role?: string;
  search?: string;
};

export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
};
