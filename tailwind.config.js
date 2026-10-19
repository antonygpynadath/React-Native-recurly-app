/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "var(--color-muted-foreground)",
        },
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        border: "var(--color-border)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        destructive: "rgb(var(--color-destructive) / <alpha-value>)",
        subscription: "rgb(var(--color-subscription) / <alpha-value>)",
        nav: "rgb(var(--color-nav) / <alpha-value>)",
      },
      spacing: {
        18: "72px",
        30: "120px",
        50: "200px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["sans-regular"],
        "sans-light": ["sans-light"],
        "sans-medium": ["sans-medium"],
        "sans-semibold": ["sans-semibold"],
        "sans-bold": ["sans-bold"],
        "sans-extrabold": ["sans-extrabold"],
      },
    },
  },
  plugins: [],
};
