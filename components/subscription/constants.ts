export type Frequency = "Monthly" | "Yearly";

export type Category =
  | "Entertainment"
  | "AI Tools"
  | "Developer Tools"
  | "Design"
  | "Productivity"
  | "Other";

export const CATEGORIES: Category[] = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#ff6b6b",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#95e1d3",
  Other: "#d4d4d4",
};

export const isCategory = (value?: string): value is Category =>
  !!value && (CATEGORIES as string[]).includes(value);

export const isFrequency = (value?: string): value is Frequency =>
  value === "Monthly" || value === "Yearly";
