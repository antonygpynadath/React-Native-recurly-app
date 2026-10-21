import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Image, Text, View } from "react-native";

const TopSubscriptionRow = ({
  icon,
  name,
  category,
  currency,
  color,
  monthlyAmount,
}: TopSubscriptionRowProps) => {
  return (
    <View className="insights-top-row" style={color ? { backgroundColor: color } : undefined}>
      <View className="insights-top-main">
        <Image source={icons[icon]} className="insights-top-icon" />
        <View className="insights-top-copy">
          <Text className="insights-top-name" numberOfLines={1}>
            {name}
          </Text>
          <Text className="insights-top-meta" numberOfLines={1}>
            {category}
          </Text>
        </View>
      </View>
      <View className="insights-top-price-box">
        <Text className="insights-top-price">{formatCurrency(monthlyAmount, currency)}</Text>
        <Text className="insights-top-billing">per month</Text>
      </View>
    </View>
  );
};

export default TopSubscriptionRow;
