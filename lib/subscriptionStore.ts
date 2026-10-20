import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { create } from "zustand";

const SUBSCRIPTIONS_KEY = "recurly.subscriptions";

const persistSubscriptions = async (subscriptions: Subscription[]) => {
  try {
    await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  } catch (error) {
    console.error("Subscriptions persist failed:", error);
  }
};

const getNextRenewalDate = (subscription: Subscription): string => {
  const period = subscription.frequency ?? subscription.billing;
  const base = dayjs(subscription.renewalDate);
  const from = base.isValid() ? base : dayjs();
  return period === "Monthly" ? from.add(1, "month").toISOString() : from.add(1, "year").toISOString();
};

interface SubscriptionStore {
  subscriptions: Subscription[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addSubscription: (subscription: Subscription) => Promise<void>;
  updateSubscription: (subscription: Subscription) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  renewSubscription: (id: string) => Promise<void>;
  setSubscriptions: (subscriptions: Subscription[]) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  hydrated: false,
  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ subscriptions: parsed as Subscription[], hydrated: true });
          return;
        }
      }
      await persistSubscriptions(HOME_SUBSCRIPTIONS);
      set({ subscriptions: HOME_SUBSCRIPTIONS, hydrated: true });
    } catch (error) {
      console.error("Subscriptions hydrate failed:", error);
      set({ subscriptions: HOME_SUBSCRIPTIONS, hydrated: true });
    }
  },
  addSubscription: async (subscription) => {
    const subscriptions = [subscription, ...get().subscriptions];
    set({ subscriptions });
    await persistSubscriptions(subscriptions);
  },
  updateSubscription: async (subscription) => {
    const subscriptions = get().subscriptions.map((s) =>
      s.id === subscription.id ? subscription : s,
    );
    set({ subscriptions });
    await persistSubscriptions(subscriptions);
  },
  deleteSubscription: async (id) => {
    const subscriptions = get().subscriptions.filter((s) => s.id !== id);
    set({ subscriptions });
    await persistSubscriptions(subscriptions);
  },
  renewSubscription: async (id) => {
    const subscriptions = get().subscriptions.map((s) =>
      s.id === id ? { ...s, renewalDate: getNextRenewalDate(s) } : s,
    );
    set({ subscriptions });
    await persistSubscriptions(subscriptions);
  },
  setSubscriptions: async (subscriptions) => {
    set({ subscriptions });
    await persistSubscriptions(subscriptions);
  },
}));
