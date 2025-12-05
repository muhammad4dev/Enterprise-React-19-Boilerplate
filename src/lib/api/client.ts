import axios from "axios";

import { APP_CONFIG } from "@/config/constants";
import { useAuthStore } from "@/stores/authStore";

import type { AuthUser } from "../rbac/types";

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from store
    const { user } = useAuthStore.getState();
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const { user, login, logout } = useAuthStore.getState();
      // Unauthorized - refresh token or if failed logout user
      if (user) {
        // try to refresh token
        apiClient
          .post("/auth/refresh-token", { token: user.token })
          .then((response) => {
            // update token in store
            login(response.data.user as AuthUser);
          })
          .catch(() => {
            // if refresh token failed, logout user
            logout();
            window.location.href = `/${APP_CONFIG.defaultLanguage}/login`;
          });
      } else {
        // logout user
        logout();
        window.location.href = `/${APP_CONFIG.defaultLanguage}/login`;
      }
    }
    return Promise.reject(error);
  },
);
