export type AppTheme = "light" | "dark";

export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  muted: string;
  mutedForeground: string;
  primary: string;
  accent: string;
  border: string;
  success: string;
  destructive: string;
  subscription: string;
  nav: string;
};

export const lightColors: ThemeColors = {
  background: "#fff9e3",
  foreground: "#081126",
  card: "#fff8e7",
  muted: "#f6eecf",
  mutedForeground: "rgba(0, 0, 0, 0.6)",
  primary: "#081126",
  accent: "#ea7a53",
  border: "rgba(0, 0, 0, 0.1)",
  success: "#16a34a",
  destructive: "#dc2626",
  subscription: "#8fd1bd",
  nav: "#081126",
};

export const darkColors: ThemeColors = {
  background: "#0c1222",
  foreground: "#fff9e3",
  card: "#151d33",
  muted: "#1a2238",
  mutedForeground: "rgba(255, 249, 227, 0.6)",
  primary: "#fff9e3",
  accent: "#ea7a53",
  border: "rgba(255, 249, 227, 0.12)",
  success: "#16a34a",
  destructive: "#dc2626",
  subscription: "#3d7a6a",
  nav: "#081126",
};

export const getColors = (theme: AppTheme): ThemeColors =>
  theme === "dark" ? darkColors : lightColors;

export const colors = lightColors;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
} as const;

export const components = {
  tabBar: {
    height: spacing[18],
    horizontalInset: spacing[5],
    radius: spacing[8],
    iconFrame: spacing[12],
    itemPaddingVertical: spacing[2],
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
