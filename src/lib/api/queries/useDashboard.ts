import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../query-keys";
import type { DashboardStats } from "../query-keys";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: async (): Promise<DashboardStats> => {
      // Mock implementation - replace with: apiClient.get('/dashboard/stats')
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        totalUsers: 1234,
        activeUsers: 856,
        revenue: 45678.9,
      };
    },
  });
};
