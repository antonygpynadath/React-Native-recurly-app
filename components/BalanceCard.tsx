import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import React from "react";
import { Text, View } from "react-native";

type BalanceCardProps = {
  amount: number;
  nextDate?: string;
};

const BalanceCard = ({ amount, nextDate }: BalanceCardProps) => {
  const formattedDate =
    nextDate && dayjs(nextDate).isValid() ? dayjs(nextDate).format("MM/DD") : null;

  return (
    <View className="home-balance-card">
      <Text className="home-balance-label">Due soon</Text>
      <View className="home-balance-row">
        <Text className="home-balance-amount">{formatCurrency(amount)}</Text>
        {formattedDate ? <Text className="home-balance-date">{formattedDate}</Text> : null}
      </View>
    </View>
  );
};

export default BalanceCard;
