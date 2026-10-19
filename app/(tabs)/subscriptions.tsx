import SubscriptionCard from "@/components/SubscriptionCard";
import EditSubscriptionModal from "@/components/subscription/EditSubscriptionModal";
import { getColors } from "@/constants/theme";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { useThemeStore } from "@/lib/themeStore";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTERS: { key: SubscriptionListFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Pending" },
];

const isSubscriptionListFilter = (value: unknown): value is SubscriptionListFilter =>
  value === "all" || value === "upcoming" || value === "pending";

const Subscriptions = () => {
  const { filter: filterParam } = useLocalSearchParams<{ filter?: string }>();
  const selectedFilter: SubscriptionListFilter = isSubscriptionListFilter(filterParam)
    ? filterParam
    : "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const { subscriptions, updateSubscription, deleteSubscription, renewSubscription } =
    useSubscriptionStore();
  const theme = useThemeStore((state) => state.theme);
  const colors = getColors(theme);

  const handleDeleteSubscription = (id: string) => {
    deleteSubscription(id);
    setExpandedId((currentId) => (currentId === id ? null : currentId));
    setEditingSubscription((current) => (current?.id === id ? null : current));
  };

  const filteredSubscriptions = useMemo(() => {
    const now = dayjs();
    const nextWeek = dayjs().add(7, "days");
    const query = searchQuery.toLowerCase();

    return subscriptions
      .filter((subscription) => {
        const matchesSearch =
          subscription.name.toLowerCase().includes(query) ||
          subscription.category?.toLowerCase().includes(query) ||
          subscription.plan?.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        if (selectedFilter === "upcoming") {
          return (
            !!subscription.renewalDate &&
            dayjs(subscription.renewalDate).isAfter(now) &&
            dayjs(subscription.renewalDate).isBefore(nextWeek)
          );
        }

        if (selectedFilter === "pending") {
          return !!subscription.renewalDate && dayjs(subscription.renewalDate).isBefore(now);
        }

        return true;
      })
      .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
  }, [subscriptions, searchQuery, selectedFilter]);

  const emptyMessage =
    selectedFilter === "upcoming"
      ? "No upcoming renewals yet."
      : selectedFilter === "pending"
        ? "No pending renewals yet."
        : "No subscriptions found.";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="pt-5">
            <Text className="text-3xl font-sans-bold text-primary mb-5">Subscriptions</Text>
            <TextInput
              className="bg-card rounded-xl px-4 py-3 text-primary mb-4"
              placeholder="Search subscriptions..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View className="flex-row gap-2 mb-4">
              {FILTERS.map(({ key, label }) => {
                const isActive = selectedFilter === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => router.setParams({ filter: key })}
                    className={clsx("category-chip", isActive && "category-chip-active")}
                  >
                    <Text
                      className={clsx(
                        "category-chip-text",
                        isActive && "category-chip-text-active",
                      )}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
            onEditPress={() => setEditingSubscription(item)}
            onRenewPress={() => renewSubscription(item.id)}
            onDeletePress={() => handleDeleteSubscription(item.id)}
          />
        )}
        ListEmptyComponent={<Text className="home-empty-state">{emptyMessage}</Text>}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        extraData={selectedFilter}
      />

      <EditSubscriptionModal
        visible={!!editingSubscription}
        subscription={editingSubscription}
        onClose={() => setEditingSubscription(null)}
        onSubmit={updateSubscription}
      />
    </SafeAreaView>
  );
};
export default Subscriptions;
