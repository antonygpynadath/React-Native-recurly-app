import IconPickerModal from "@/components/IconPickerModal";
import {
  DEFAULT_SUBSCRIPTION_ICON,
  formatIconLabel,
  icons,
  type IconKey,
} from "@/constants/icons";
import { getColors } from "@/constants/theme";
import { useThemeStore } from "@/lib/themeStore";
import { formatSubscriptionDateTime } from "@/lib/utils";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  type Category,
  type Frequency,
} from "./constants";

export interface SubscriptionFormValues {
  name: string;
  price: number;
  frequency: Frequency;
  category: Category;
  icon: IconKey;
  startDate: string;
  renewalDate: string;
  billing: Frequency;
  color: string;
}

export interface SubscriptionFormInitialValues {
  name: string;
  price: string;
  frequency: Frequency;
  category: Category;
  icon: IconKey;
  startDate: Date;
}

interface SubscriptionFormModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  initialValues: SubscriptionFormInitialValues;
  onSubmit: (values: SubscriptionFormValues) => void;
}

const SubscriptionFormModal = ({
  visible,
  onClose,
  title,
  submitLabel,
  initialValues,
  onSubmit,
}: SubscriptionFormModalProps) => {
  const theme = useThemeStore((state) => state.theme);
  const colors = getColors(theme);
  const [name, setName] = useState(initialValues.name);
  const [price, setPrice] = useState(initialValues.price);
  const [frequency, setFrequency] = useState<Frequency>(initialValues.frequency);
  const [category, setCategory] = useState<Category>(initialValues.category);
  const [iconKey, setIconKey] = useState<IconKey>(initialValues.icon);
  const [iconPickerVisible, setIconPickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setName(initialValues.name);
    setPrice(initialValues.price);
    setFrequency(initialValues.frequency);
    setCategory(initialValues.category);
    setIconKey(initialValues.icon);
    setStartDate(initialValues.startDate);
    setShowDatePicker(false);
    setIconPickerVisible(false);
    // Hydrate only when the modal opens so parent re-renders do not reset in-progress edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const isValidPrice = () => {
    const trimmedPrice = price.trim();
    if (!trimmedPrice) return false;
    if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPrice)) return false;
    const numValue = Number(trimmedPrice);
    return Number.isFinite(numValue) && numValue > 0;
  };

  const isValidForm = name.trim() !== "" && isValidPrice();

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!isValidForm) return;

    const priceValue = Number(price.trim());
    const start = dayjs(startDate);
    const renewalDate = frequency === "Monthly" ? start.add(1, "month") : start.add(1, "year");

    onSubmit({
      name: name.trim(),
      price: priceValue,
      frequency,
      category,
      icon: iconKey,
      startDate: start.toISOString(),
      renewalDate: renewalDate.toISOString(),
      billing: frequency,
      color: CATEGORY_COLORS[category],
    });

    onClose();
  };

  const handleClose = () => {
    setShowDatePicker(false);
    setIconPickerVisible(false);
    onClose();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={0}
        >
          <Pressable className="modal-overlay" onPress={handleClose}>
            <Pressable className="modal-container" onPress={(e) => e.stopPropagation()}>
              <View className="modal-header">
                <Text className="modal-title">{title}</Text>
                <Pressable className="modal-close" onPress={handleClose}>
                  <Text className="modal-close-text">✕</Text>
                </Pressable>
              </View>

              <ScrollView
                className="p-5"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
              >
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="Subscription name"
                    placeholderTextColor={colors.mutedForeground}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Price</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="0.00"
                    placeholderTextColor={colors.mutedForeground}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Icon</Text>
                  <View className="icon-field-row">
                    <View className="icon-field-preview">
                      <Image source={icons[iconKey]} className="icon-field-preview-image" />
                    </View>
                    <Pressable
                      className="icon-field-button"
                      onPress={() => setIconPickerVisible(true)}
                    >
                      <Text className="icon-field-button-text">
                        Choose icon ({formatIconLabel(iconKey)})
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Start Date</Text>
                  <Pressable
                    className="icon-field-button"
                    onPress={() => setShowDatePicker((prev) => !prev)}
                  >
                    <Text className="icon-field-button-text">
                      {formatSubscriptionDateTime(startDate.toISOString())}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleStartDateChange}
                    />
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    <Pressable
                      className={clsx(
                        "picker-option",
                        frequency === "Monthly" && "picker-option-active",
                      )}
                      onPress={() => setFrequency("Monthly")}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === "Monthly" && "picker-option-text-active",
                        )}
                      >
                        Monthly
                      </Text>
                    </Pressable>
                    <Pressable
                      className={clsx(
                        "picker-option",
                        frequency === "Yearly" && "picker-option-active",
                      )}
                      onPress={() => setFrequency("Yearly")}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === "Yearly" && "picker-option-text-active",
                        )}
                      >
                        Yearly
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        className={clsx("category-chip", category === cat && "category-chip-active")}
                        onPress={() => setCategory(cat)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            category === cat && "category-chip-text-active",
                          )}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <Pressable
                  className={clsx("auth-button", !isValidForm && "auth-button-disabled")}
                  onPress={handleSubmit}
                  disabled={!isValidForm}
                >
                  <Text className="auth-button-text">{submitLabel}</Text>
                </Pressable>
              </ScrollView>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <IconPickerModal
        visible={iconPickerVisible}
        selectedIcon={iconKey}
        onClose={() => setIconPickerVisible(false)}
        onConfirm={setIconKey}
      />
    </>
  );
};

export const DEFAULT_FORM_VALUES: SubscriptionFormInitialValues = {
  name: "",
  price: "",
  frequency: "Monthly",
  category: "Other",
  icon: DEFAULT_SUBSCRIPTION_ICON,
  startDate: new Date(),
};

export default SubscriptionFormModal;
