import { useMutation } from "@tanstack/react-query";

import type { AuthUser } from "@/lib/rbac/types";
import { useAuthStore } from "@/stores/authStore";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: AuthUser;
}

// Mock login mutation - replace with real API call
export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials,
    ): Promise<LoginResponse> => {
      // Mock implementation - replace with: apiClient.post('/auth/login', credentials)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data based on email
      const mockUser: AuthUser = {
        id: "1",
        name: credentials.email.split("@")[0],
        email: credentials.email,
        role: credentials.email.includes("admin") ? "ADMIN" : "USER",
        permissions: credentials.email.includes("admin")
          ? ["view:dashboard", "view:admin", "manage:users", "manage:settings"]
          : ["view:dashboard"],
        token: "mock-jwt-token-" + Date.now(),
      };

      return {
        user: mockUser,
      };
    },
    onSuccess: (data) => {
      login(data.user);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // In real app: await apiClient.post('/auth/logout');
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      logout();
    },
  });
};
