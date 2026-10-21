import dayjs from "dayjs";

export const toMonthlyEquivalent = (subscription: Subscription): number => {
  const period = subscription.frequency ?? subscription.billing;
  return period === "Yearly" ? subscription.price / 12 : subscription.price;
};

export const getSpendSummary = (subscriptions: Subscription[]): SpendSummary => {
  const monthlyTotal = subscriptions.reduce(
    (sum, subscription) => sum + toMonthlyEquivalent(subscription),
    0,
  );

  return {
    monthlyTotal,
    yearlyProjection: monthlyTotal * 12,
    activeCount: subscriptions.length,
  };
};

export const getCategoryBreakdown = (
  subscriptions: Subscription[],
): CategoryBreakdownItem[] => {
  const totals = new Map<string, number>();

  for (const subscription of subscriptions) {
    const category = subscription.category?.trim() || "Other";
    const current = totals.get(category) ?? 0;
    totals.set(category, current + toMonthlyEquivalent(subscription));
  }

  const monthlyTotal = Array.from(totals.values()).reduce((sum, amount) => sum + amount, 0);

  return Array.from(totals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percent: monthlyTotal > 0 ? (amount / monthlyTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

const getBillingPeriod = (subscription: Subscription): "Monthly" | "Yearly" => {
  const period = subscription.frequency ?? subscription.billing;
  return period === "Yearly" ? "Yearly" : "Monthly";
};

const advanceRenewal = (date: dayjs.Dayjs, period: "Monthly" | "Yearly"): dayjs.Dayjs =>
  period === "Yearly" ? date.add(1, "year") : date.add(1, "month");

export const getRenewalForecast = (
  subscriptions: Subscription[],
  months = 6,
): RenewalForecastMonth[] => {
  const start = dayjs().startOf("month");
  const end = start.add(months, "month");

  const buckets = Array.from({ length: months }, (_, index) => {
    const month = start.add(index, "month");
    return {
      key: month.format("YYYY-MM"),
      label: month.format("MMM"),
      amount: 0,
    };
  });

  const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const subscription of subscriptions) {
    if (!subscription.renewalDate) continue;

    let renewal = dayjs(subscription.renewalDate);
    if (!renewal.isValid()) continue;

    const period = getBillingPeriod(subscription);

    // Walk forward from a past renewal until we reach the forecast window.
    let guard = 0;
    while (renewal.isBefore(start) && guard < 120) {
      renewal = advanceRenewal(renewal, period);
      guard += 1;
    }

    guard = 0;
    while (renewal.isBefore(end) && guard < 24) {
      const key = renewal.format("YYYY-MM");
      const bucket = bucketByKey.get(key);
      if (bucket) {
        bucket.amount += subscription.price;
      }
      renewal = advanceRenewal(renewal, period);
      guard += 1;
    }
  }

  return buckets;
};

export const getTopSubscriptions = (
  subscriptions: Subscription[],
  limit = 5,
): TopSubscriptionItem[] =>
  [...subscriptions]
    .map((subscription) => ({
      id: subscription.id,
      icon: subscription.icon,
      name: subscription.name,
      category: subscription.category?.trim() || "Other",
      currency: subscription.currency,
      color: subscription.color,
      monthlyAmount: toMonthlyEquivalent(subscription),
    }))
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
    .slice(0, limit);
