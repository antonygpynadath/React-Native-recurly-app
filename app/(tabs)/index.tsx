import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import "../../global.css";
import { posthog, posthogLog } from "../../lib/posthog";

export default function Index() {
  const { user } = useUser();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { addSubscription } = useSubscriptionStore();

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
  // Get user display name: firstName, fullName, or email
  const displayName =
    user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || "User";

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        data={HOME_SUBSCRIPTIONS}
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
                <Image source={icons.add} className="home-add-icon" />
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
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">No upcoming renewals yet.</Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              const isExpanded = expandedSubscriptionId !== item.id;
              setExpandedSubscriptionId(isExpanded ? item.id : null);
              posthog?.capture("subscription_expansion_toggled", {
                subscription_id: item.id,
                is_expanded: isExpanded,
              });
              posthogLog.info("subscription_expansion_toggled", {
                subscription_id: item.id,
                is_expanded: isExpanded,
              });
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
        contentContainerClassName="pb-20"
      />

      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}
