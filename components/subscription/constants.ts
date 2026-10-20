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

export type PaymentType = "Cash" | "Credit card" | "Debit card";

export const PAYMENT_TYPES: PaymentType[] = ["Cash", "Credit card", "Debit card"];

export const formatPaymentMethod = (
  type: PaymentType | null,
  cardNumber: string,
): string | undefined => {
  if (!type) return undefined;
  if (type === "Cash") return "Cash";
  const digits = cardNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return last4 ? `${type} ending in ${last4}` : type;
};

export const parsePaymentMethod = (
  value?: string,
): { paymentType: PaymentType | null; cardNumber: string } => {
  if (!value?.trim()) return { paymentType: null, cardNumber: "" };

  const trimmed = value.trim();
  const endingMatch = trimmed.match(/ending in\s+(\d+)/i);
  const last4 = endingMatch?.[1] ?? "";

  if (/^cash$/i.test(trimmed)) {
    return { paymentType: "Cash", cardNumber: "" };
  }
  if (/debit/i.test(trimmed)) {
    return { paymentType: "Debit card", cardNumber: last4 };
  }
  if (/credit|visa|mastercard|amex/i.test(trimmed)) {
    return { paymentType: "Credit card", cardNumber: last4 };
  }

  return { paymentType: null, cardNumber: "" };
};
