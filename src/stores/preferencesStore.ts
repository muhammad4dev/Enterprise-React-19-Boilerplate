import { create } from "zustand";
import { persist } from "zustand/middleware";

import { APP_CONFIG, STORAGE_KEYS } from "@/config/constants";

type Locale = "en" | "ar";
type Direction = "ltr" | "rtl";
type ThemeMode = "light" | "dark";

interface PreferencesState {
  locale: Locale;
  direction: Direction;
  themeMode: ThemeMode;
  setLocale: (locale: Locale) => void;
  setDirection: (dir: Direction) => void;
  toggleTheme: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: APP_CONFIG.defaultLanguage as Locale,
      direction: APP_CONFIG.defaultDirection as Direction,
      themeMode: "light",
      setLocale: (locale) => set({ locale }),
      setDirection: (direction) => set({ direction }),
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === "light" ? "dark" : "light",
        })),
    }),
    {
      name: STORAGE_KEYS.THEME_MODE, // Unique name for localStorage key
      partialize: (state) => ({
        themeMode: state.themeMode,
        locale: state.locale,
        direction: state.direction,
      }),
    },
  ),
);
