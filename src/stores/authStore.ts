import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/constants";
import type { AuthUser } from "@/lib/rbac/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
