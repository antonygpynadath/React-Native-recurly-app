import {
  DEFAULT_SUBSCRIPTION_ICON,
  formatIconLabel,
  icons,
  SUBSCRIPTION_ICON_KEYS,
  type IconKey,
} from "@/constants/icons";
import { getColors } from "@/constants/theme";
import { useThemeStore } from "@/lib/themeStore";
import { Ionicons } from "@expo/vector-icons";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface IconPickerModalProps {
  visible: boolean;
  selectedIcon: IconKey;
  onClose: () => void;
  onConfirm: (icon: IconKey) => void;
}

const IconPickerModal = ({
  visible,
  selectedIcon,
  onClose,
  onConfirm,
}: IconPickerModalProps) => {
  const theme = useThemeStore((state) => state.theme);
  const colors = getColors(theme);
  const [draftIcon, setDraftIcon] = useState<IconKey>(selectedIcon);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (visible) {
      setDraftIcon(selectedIcon || DEFAULT_SUBSCRIPTION_ICON);
      setSearch("");
    }
  }, [visible, selectedIcon]);

  const filteredKeys = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return SUBSCRIPTION_ICON_KEYS;
    return SUBSCRIPTION_ICON_KEYS.filter((key) => key.toLowerCase().includes(query));
  }, [search]);

  const handleConfirm = () => {
    onConfirm(draftIcon);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="modal-overlay" onPress={onClose}>
        <Pressable className="modal-container" onPress={(e) => e.stopPropagation()}>
          <View className="modal-header">
            <Text className="modal-title">Choose an icon</Text>
            <Pressable className="modal-close" onPress={onClose}>
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>

          <View className="icon-picker-search">
            <Ionicons name="search" size={18} color={colors.mutedForeground} />
            <TextInput
              className="icon-picker-search-input"
              placeholder="Search icons..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={filteredKeys}
            keyExtractor={(item) => item}
            numColumns={4}
            className="mx-4 max-h-80"
            contentContainerStyle={{ paddingBottom: 12, gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text className="py-8 text-center text-sm font-sans-medium text-muted-foreground">
                No icons found
              </Text>
            }
            renderItem={({ item }) => {
              const isSelected = item === draftIcon;
              return (
                <Pressable
                  className={clsx(
                    "icon-picker-card",
                    isSelected && "icon-picker-card-active",
                  )}
                  onPress={() => setDraftIcon(item)}
                >
                  <Image source={icons[item]} className="icon-picker-card-image" />
                  <Text
                    numberOfLines={1}
                    className={clsx(
                      "icon-picker-card-label",
                      isSelected && "icon-picker-card-label-active",
                    )}
                  >
                    {formatIconLabel(item)}
                  </Text>
                </Pressable>
              );
            }}
          />

          <View className="icon-picker-footer">
            <Text className="icon-picker-selected" numberOfLines={1}>
              Selected: {formatIconLabel(draftIcon)}
            </Text>
            <Pressable className="icon-picker-confirm" onPress={handleConfirm}>
              <Text className="icon-picker-confirm-text">Confirm selection</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default IconPickerModal;
