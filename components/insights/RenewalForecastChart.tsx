import { getColors } from "@/constants/theme";
import { formatCurrency } from "@/lib/utils";
import { useThemeStore } from "@/lib/themeStore";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

const CHART_HEIGHT = 140;

const getPeakKey = (months: RenewalForecastMonth[]): string | undefined => {
  if (months.length === 0) return undefined;
  return months.reduce((best, month) => (month.amount > best.amount ? month : best), months[0])
    .key;
};

const RenewalForecastChart = ({ months }: RenewalForecastChartProps) => {
  const theme = useThemeStore((state) => state.theme);
  const colors = getColors(theme);

  const maxAmount = useMemo(
    () => Math.max(...months.map((month) => month.amount), 0),
    [months],
  );

  const [selectedKey, setSelectedKey] = useState<string | undefined>(() => getPeakKey(months));

  useEffect(() => {
    setSelectedKey((current) => {
      if (current && months.some((month) => month.key === current)) return current;
      return getPeakKey(months);
    });
  }, [months]);

  const selected = months.find((month) => month.key === selectedKey) ?? months[0];

  if (months.length === 0) return null;

  return (
    <View className="insights-section">
      <Text className="insights-section-title">Renewal forecast</Text>
      <View className="insights-forecast-card">
        {selected ? (
          <View className="insights-forecast-tooltip">
            <Text className="insights-forecast-tooltip-text">
              {selected.label}: {formatCurrency(selected.amount)}
            </Text>
          </View>
        ) : null}

        <View className="insights-forecast-bars" style={{ height: CHART_HEIGHT }}>
          {months.map((month) => {
            const height =
              maxAmount > 0
                ? Math.max((month.amount / maxAmount) * (CHART_HEIGHT - 8), month.amount > 0 ? 8 : 4)
                : 4;
            const isSelected = month.key === selected?.key;

            return (
              <Pressable
                key={month.key}
                onPress={() => setSelectedKey(month.key)}
                className="insights-forecast-bar-col"
              >
                <View
                  className="insights-forecast-bar"
                  style={{
                    height,
                    backgroundColor: isSelected ? colors.accent : colors.primary,
                  }}
                />
                <Text
                  className="insights-forecast-label"
                  style={{ color: isSelected ? colors.accent : colors.mutedForeground }}
                >
                  {month.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default RenewalForecastChart;
