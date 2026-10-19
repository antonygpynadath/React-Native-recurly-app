import type { AppTheme } from "@/constants/theme";
import * as SecureStore from "expo-secure-store";
import { colorScheme } from "nativewind";
import { create } from "zustand";

const THEME_KEY = "recurly.theme";

const isAppTheme = (value: string | null): value is AppTheme =>
  value === "light" || value === "dark";

interface ThemeStore {
  theme: AppTheme;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTheme: (theme: AppTheme) => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",
  hydrated: false,
  hydrate: async () => {
    try {
      const stored = await SecureStore.getItemAsync(THEME_KEY);
      const theme: AppTheme = isAppTheme(stored) ? stored : "light";
      colorScheme.set(theme);
      set({ theme, hydrated: true });
    } catch (error) {
      console.error("Theme hydrate failed:", error);
      colorScheme.set("light");
      set({ theme: "light", hydrated: true });
    }
  },
  setTheme: async (theme) => {
    colorScheme.set(theme);
    set({ theme });
    try {
      await SecureStore.setItemAsync(THEME_KEY, theme);
    } catch (error) {
      console.error("Theme persist failed:", error);
    }
  },
}));
