import SubscriptionCard from "@/components/SubscriptionCard";
import EditSubscriptionModal from "@/components/subscription/EditSubscriptionModal";
import { getColors } from "@/constants/theme";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { useThemeStore } from "@/lib/themeStore";
import { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Subscriptions = () => {
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

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-5">
            <Text className="text-3xl font-sans-bold text-primary mb-5">Subscriptions</Text>
            <TextInput
              className="bg-card rounded-xl px-4 py-3 text-primary mb-4"
              placeholder="Search subscriptions..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
