import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/** Prefix so we can cancel only renewal reminders without touching other scheduled notifications. */
const RENEWAL_ID_PREFIX = "renewal-";

/** Local hour (device timezone) when the day-before renewal reminder fires. */
const RENEWAL_REMINDER_HOUR = 9;

/** Opens the upcoming-subscriptions filter when the user taps a renewal reminder. */
const SUBSCRIPTIONS_DEEP_LINK = "recurly:///(tabs)/subscriptions?filter=upcoming";

// Show banners/sounds even while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const renewalIdentifier = (subscriptionId: string) =>
  `${RENEWAL_ID_PREFIX}${subscriptionId}`;

/**
 * Requests permission and returns an Expo push token for remote notifications.
 * Returns null on web, simulators, missing permission, or missing EAS projectId.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === "web") return null;

  // Expo push tokens are only available on physical devices.
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  // Android 8+ requires a channel before notifications can be delivered.
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Notification permission not granted");
    return null;
  }

  // Required by getExpoPushTokenAsync in SDK 49+.
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    console.warn("EAS projectId not found; cannot get Expo push token");
    return null;
  }

  try {
    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    return pushToken.data;
  } catch (error) {
    console.error("Failed to get Expo push token:", error);
    return null;
  }
}

/**
 * Rebuilds local renewal reminders from the current subscription list.
 * Cancels existing renewal schedules first so deleted/changed renewals do not linger.
 * Each reminder fires at 9:00 local time the day before renewalDate.
 */
export async function syncRenewalReminders(subscriptions: Subscription[]): Promise<void> {
  if (Platform.OS === "web") return;

  // Wipe previous renewal reminders so the set always matches current data.
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(RENEWAL_ID_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );

  const now = dayjs();

  for (const subscription of subscriptions) {
    if (!subscription.renewalDate) continue;

    const renewal = dayjs(subscription.renewalDate);
    if (!renewal.isValid()) continue;

    // Day before renewal at RENEWAL_REMINDER_HOUR (local time).
    const fireAt = renewal
      .subtract(1, "day")
      .hour(RENEWAL_REMINDER_HOUR)
      .minute(0)
      .second(0)
      .millisecond(0);

    // Skip reminders whose fire time has already passed.
    if (!fireAt.isAfter(now)) continue;

    const currency = subscription.currency ?? "USD";
    const priceLabel = formatCurrency(subscription.price, currency);

    await Notifications.scheduleNotificationAsync({
      identifier: renewalIdentifier(subscription.id),
      content: {
        title: "Renewal tomorrow",
        body: `${subscription.name} renews for ${priceLabel}`,
        data: {
          url: SUBSCRIPTIONS_DEEP_LINK,
          subscriptionId: subscription.id,
        },
        sound: "default",
        ...(Platform.OS === "android" ? { channelId: "default" } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt.toDate(),
      },
    });
  }
}

type NotificationData = {
  url?: unknown;
  path?: unknown;
};

/**
 * Reads a deep link from notification payload data.
 * Prefers `url` (full scheme); falls back to `path` (app-relative route).
 */
export function getNotificationDeepLink(
  response: Notifications.NotificationResponse,
): string | null {
  const data = response.notification.request.content.data as NotificationData | undefined;
  if (!data) return null;

  if (typeof data.url === "string" && data.url.length > 0) {
    return data.url;
  }

  if (typeof data.path === "string" && data.path.length > 0) {
    // Normalize so Expo Router can treat it as an absolute in-app path.
    return data.path.startsWith("/") ? data.path : `/${data.path}`;
  }

  return null;
}

type NotificationListenersOptions = {
  onResponse: (response: Notifications.NotificationResponse) => void;
};

/** Dedupes cold-start + live listener so the same tap is not handled twice. */
const handledResponseKeys = new Set<string>();

const responseKey = (response: Notifications.NotificationResponse) =>
  `${response.notification.request.identifier}:${response.notification.date}`;

/**
 * Subscribes to notification tap events (foreground and cold start).
 * Returns a cleanup function that removes both listeners.
 */
export function addNotificationListeners({
  onResponse,
}: NotificationListenersOptions): () => void {
  const handleResponse = (response: Notifications.NotificationResponse) => {
    const key = responseKey(response);
    if (handledResponseKeys.has(key)) return;
    handledResponseKeys.add(key);
    onResponse(response);
  };

  const receivedSubscription = Notifications.addNotificationReceivedListener(() => {
    // Foreground receipt; presentation handled by setNotificationHandler.
  });

  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener(handleResponse);

  // App opened from a killed state by tapping a notification.
  void Notifications.getLastNotificationResponseAsync().then((response) => {
    if (response) handleResponse(response);
  });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
