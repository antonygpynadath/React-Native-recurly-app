import { CATEGORY_COLORS, isCategory } from "@/components/subscription/constants";
import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Text, View } from "react-native";

const CategoryBreakdown = ({ items }: CategoryBreakdownProps) => {
  if (items.length === 0) return null;

  return (
    <View className="insights-section">
      <Text className="insights-section-title">By category</Text>
      <View className="insights-category-card">
        {items.map((item) => {
          const barColor = isCategory(item.category)
            ? CATEGORY_COLORS[item.category]
            : CATEGORY_COLORS.Other;

          return (
            <View key={item.category} className="insights-category-row">
              <View className="insights-category-head">
                <Text className="insights-category-name">{item.category}</Text>
                <Text className="insights-category-amount">
                  {formatCurrency(item.amount)} · {Math.round(item.percent)}%
                </Text>
              </View>
              <View className="insights-category-track">
                <View
                  className="insights-category-fill"
                  style={{ width: `${Math.max(item.percent, 2)}%`, backgroundColor: barColor }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CategoryBreakdown;
