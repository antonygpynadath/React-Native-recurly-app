import { useSubscriptionStore } from "@/lib/subscriptionStore";
import {
  addNotificationListeners,
  getNotificationDeepLink,
  registerForPushNotificationsAsync,
  syncRenewalReminders,
} from "@/lib/notifications";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export function useNotifications() {
  const router = useRouter();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const hydrated = useSubscriptionStore((state) => state.hydrated);

  useEffect(() => {
    if (Platform.OS === "web") return;

    let cancelled = false;

    //register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      if (!cancelled && token) {
        console.log("Expo push token:", token);
      }
    });

    const removeListeners = addNotificationListeners({
      onResponse: (response) => {
        const deepLink = getNotificationDeepLink(response);
        if (!deepLink) return;

        if (deepLink.includes("://")) {
          void Linking.openURL(deepLink);
          return;
        }

        router.push(deepLink as never);
      },
    });

    return () => {
      cancelled = true;
      removeListeners();
    };
  }, [router]);

  useEffect(() => {
    if (Platform.OS === "web" || !hydrated) return;
    void syncRenewalReminders(subscriptions);
  }, [hydrated, subscriptions]);
}
