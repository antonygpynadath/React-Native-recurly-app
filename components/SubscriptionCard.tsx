import ConfirmDialog from "@/components/ConfirmDialog";
import { icons } from "@/constants/icons";
import { getColors } from "@/constants/theme";
import { formatCurrency, formatSubscriptionDateTime, getRenewalStatusLabel } from "@/lib/utils";
import { useThemeStore } from "@/zustand/themeStore";
import { Ionicons } from "@expo/vector-icons";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

const fallbackMessage = "Not provided";

type ConfirmType = "renew" | "delete";

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
  const hasActions = !!(onEditPress || onRenewPress || onDeletePress);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmType, setConfirmType] = useState<ConfirmType | null>(null);
  const theme = useThemeStore((state) => state.theme);
  const colors = getColors(theme);

  useEffect(() => {
    if (!expanded) {
      setMenuVisible(false);
      setConfirmType(null);
    }
  }, [expanded]);

  const closeMenu = () => setMenuVisible(false);

  const handleEdit = () => {
    closeMenu();
    onEditPress?.();
  };

  const handleRenewRequest = () => {
    closeMenu();
    setConfirmType("renew");
  };

  const handleDeleteRequest = () => {
    closeMenu();
    setConfirmType("delete");
  };

  const handleConfirm = () => {
    if (confirmType === "renew") {
      onRenewPress?.();
    } else if (confirmType === "delete") {
      onDeletePress?.();
    }
    setConfirmType(null);
  };

  return (
    <>
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

          {expanded && hasActions && (
            <Pressable
              className="sub-menu-btn"
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation?.();
                setMenuVisible(true);
              }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={colors.primary} />
            </Pressable>
          )}
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
          </View>
        )}
      </Pressable>

      <Modal visible={menuVisible} transparent animationType="slide" onRequestClose={closeMenu}>
        <Pressable className="action-menu-overlay" onPress={closeMenu}>
          <Pressable className="action-menu-container" onPress={(e) => e.stopPropagation()}>
            {onEditPress && (
              <Pressable className="action-menu-item" onPress={handleEdit}>
                <Text className="action-menu-item-text">Edit</Text>
              </Pressable>
            )}
            {onRenewPress && (
              <Pressable className="action-menu-item" onPress={handleRenewRequest}>
                <Text className="action-menu-item-text">Renew</Text>
              </Pressable>
            )}
            {onDeletePress && (
              <Pressable className="action-menu-item" onPress={handleDeleteRequest}>
                <Text className="action-menu-item-text action-menu-item-destructive">Delete</Text>
              </Pressable>
            )}
            <Pressable className="action-menu-cancel" onPress={closeMenu}>
              <Text className="action-menu-cancel-text">Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmDialog
        visible={confirmType === "renew"}
        title={`Renew ${name}?`}
        message="This will advance the renewal date to the next billing period."
        confirmLabel="Renew"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmType(null)}
      />

      <ConfirmDialog
        visible={confirmType === "delete"}
        title={`Delete ${name}?`}
        message="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirm}
        onCancel={() => setConfirmType(null)}
      />
    </>
  );
};

export default SubscriptionCard;
