import { icons } from "@/constants/icons";
import { formatCurrency, formatSubscriptionDateTime, getRenewalStatusLabel } from "@/lib/utils";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const fallbackMessage = "Not provided";

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  expanded,
  onPress,
  onEditPress,
  onDeletePress,
  onRenewPress,
  paymentMethod,
  startDate,
}: SubscriptionCardProps) => {
  const hasActions = onEditPress || onRenewPress || onDeletePress;

  return (
    <Pressable
      onPress={onPress}
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icons[icon]} className="sub-icon" />
          <View className="sub-copy">
            <Text numberOfLines={1} className="sub-title">
              {name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {category?.trim() ||
                plan?.trim() ||
                (renewalDate ? formatSubscriptionDateTime(renewalDate) : "")}
            </Text>
          </View>
        </View>

        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>
      {expanded && (
        <View className="sub-bdy">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Payment:</Text>
                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                  {paymentMethod?.trim() || fallbackMessage}
                </Text>
              </View>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Category:</Text>
                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                  {category?.trim() || plan?.trim() || fallbackMessage}
                </Text>
              </View>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Started:</Text>
                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                  {startDate ? formatSubscriptionDateTime(startDate) : "--"}
                </Text>
              </View>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Renewal Date:</Text>
                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                  {renewalDate ? formatSubscriptionDateTime(renewalDate) : "--"}
                </Text>
              </View>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Status:</Text>
                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                  {getRenewalStatusLabel(renewalDate)}
                </Text>
              </View>
            </View>
          </View>

          {hasActions && (
            <View className="sub-actions">
              {onEditPress && (
                <Pressable
                  className="sub-action"
                  onPress={(event) => {
                    event.stopPropagation?.();
                    onEditPress();
                  }}
                >
                  <Text className="sub-action-text">Edit</Text>
                </Pressable>
              )}
              {onRenewPress && (
                <Pressable
                  className="sub-action"
                  onPress={(event) => {
                    event.stopPropagation?.();
                    onRenewPress();
                  }}
                >
                  <Text className="sub-action-text">Renew</Text>
                </Pressable>
              )}
              {onDeletePress && (
                <Pressable
                  className="sub-action sub-action-delete"
                  onPress={(event) => {
                    event.stopPropagation?.();
                    onDeletePress();
                  }}
                >
                  <Text className="sub-action-text">Delete</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default SubscriptionCard;
