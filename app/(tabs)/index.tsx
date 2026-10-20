import ListHeading from "@/components/ListHeading";
import CreateSubscriptionModal from "@/components/subscription/CreateSubscriptionModal";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE } from "@/constants/data";
import { icons } from "@/constants/icons";
import { getColors } from "@/constants/theme";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { useThemeStore } from "@/lib/themeStore";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import { posthog } from "../../lib/posthog";

export default function Index() {
  const { user } = useUser();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const colors = getColors(theme);

  const navigateToSubscriptions = (filter: SubscriptionListFilter) => {
    router.push({
      pathname: "/subscriptions",
      params: { filter },
    });
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { subscriptions, addSubscription } = useSubscriptionStore();

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const handleCreateSubscription = (newSubscription: Subscription) => {
    addSubscription(newSubscription);
    posthog?.capture("subscription_created", {
      subscription_name: newSubscription.name,
      subscription_price: newSubscription.price,
      subscription_frequency: newSubscription.frequency ?? "",
      subscription_category: newSubscription.category ?? "",
    });
  };

  // Get upcoming subscriptions (active subscriptions with renewal date within next 7 days)
  const upcomingSubscriptions = useMemo(() => {
    const now = dayjs();
    const nextWeek = dayjs().add(7, "days");
    return subscriptions
      .filter(
        (sub) =>
          !!sub.renewalDate &&
          dayjs(sub.renewalDate).isAfter(now) &&
          dayjs(sub.renewalDate).isBefore(nextWeek),
      )
      .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)))
      .map((sub) => ({
        id: sub.id,
        icon: sub.icon,
        name: sub.name,
        price: sub.price,
        currency: sub.currency,
        daysLeft: dayjs(sub.renewalDate).startOf("day").diff(dayjs().startOf("day"), "day"),
      }));
  }, [subscriptions]);

  const pendingSubscriptions = useMemo(() => {
    return subscriptions
      .filter((sub) => !!sub.renewalDate && dayjs(sub.renewalDate).isBefore(dayjs()))
      .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
  }, [subscriptions]);

  const handleSubscriptionPress = (item: Subscription) => {
    const isExpanding = expandedSubscriptionId !== item.id;
    setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id));
    posthog?.capture(isExpanding ? "subscription_expanded" : "subscription_collapsed", {
      subscription_name: item.name,
      subscription_id: item.id,
    });
  };

  // Get user display name: firstName, fullName, or email
  const displayName =
    user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || "User";

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        data={pendingSubscriptions}
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Pressable
                onPress={() => {
                  setIsModalVisible(true);
                }}
              >
                <Image
                  source={icons.add}
                  className="home-add-icon"
                  style={{ tintColor: colors.primary }}
                />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading
                title="Upcoming"
                onViewAllPress={() => navigateToSubscriptions("upcoming")}
              />
              <FlatList
                data={upcomingSubscriptions}
                renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">No upcoming renewals yet.</Text>
                }
              />
            </View>

            <ListHeading
              title="Pending"
              onViewAllPress={() => navigateToSubscriptions("pending")}
            />
          </>
        )}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              handleSubscriptionPress(item);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No pending renewals yet.</Text>}
        contentContainerClassName="pb-30"
      />

      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}
