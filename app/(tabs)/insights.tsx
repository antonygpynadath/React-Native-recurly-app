import CategoryBreakdown from "@/components/insights/CategoryBreakdown";
import RenewalForecastChart from "@/components/insights/RenewalForecastChart";
import SpendSummaryCard from "@/components/insights/SpendSummaryCard";
import TopSubscriptionRow from "@/components/insights/TopSubscriptionRow";
import {
  getCategoryBreakdown,
  getRenewalForecast,
  getSpendSummary,
  getTopSubscriptions,
} from "@/lib/insights";
import { useSubscriptionStore } from "@/zustand/subscriptionStore";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Insights = () => {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);

  const { summary, categories, forecast, topSubscriptions } = useMemo(() => {
    return {
      summary: getSpendSummary(subscriptions),
      categories: getCategoryBreakdown(subscriptions),
      forecast: getRenewalForecast(subscriptions, 6),
      topSubscriptions: getTopSubscriptions(subscriptions, 5),
    };
  }, [subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-30"
        showsVerticalScrollIndicator={false}
      >
        <Text className="pt-5 mb-2 text-3xl font-sans-bold text-primary">Monthly Insights</Text>

        {subscriptions.length === 0 ? (
          <Text className="insights-empty-state">
            Add subscriptions to see your spending insights.
          </Text>
        ) : (
          <>
            <SpendSummaryCard
              monthlyTotal={summary.monthlyTotal}
              yearlyProjection={summary.yearlyProjection}
              activeCount={summary.activeCount}
            />

            <CategoryBreakdown items={categories} />

            <RenewalForecastChart months={forecast} />

            <View className="insights-section">
              <Text className="insights-section-title">Top subscriptions</Text>
              <View className="gap-3">
                {topSubscriptions.map((item) => (
                  <TopSubscriptionRow key={item.id} {...item} />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
