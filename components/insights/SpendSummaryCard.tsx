import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Text, View } from "react-native";

const SpendSummaryCard = ({
  monthlyTotal,
  yearlyProjection,
  activeCount,
}: SpendSummaryCardProps) => {
  return (
    <View className="insights-summary-card">
      <Text className="insights-summary-label">Monthly recurring</Text>
      <Text className="insights-summary-amount">{formatCurrency(monthlyTotal)}</Text>
      <View className="insights-summary-meta-row">
        <View>
          <Text className="insights-summary-meta-label">Yearly projection</Text>
          <Text className="insights-summary-meta-value">{formatCurrency(yearlyProjection)}</Text>
        </View>
        <View className="items-end">
          <Text className="insights-summary-meta-label">Active</Text>
          <Text className="insights-summary-meta-value">
            {activeCount} {activeCount === 1 ? "subscription" : "subscriptions"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SpendSummaryCard;
