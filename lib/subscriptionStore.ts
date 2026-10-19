import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const SUBSCRIPTIONS_KEY = "recurly.subscriptions";

const persistSubscriptions = async (subscriptions: Subscription[]) => {
  try {
    await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  } catch (error) {
    console.error("Subscriptions persist failed:", error);
  }
};

interface SubscriptionStore {
  subscriptions: Subscription[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addSubscription: (subscription: Subscription) => Promise<void>;
  updateSubscription: (subscription: Subscription) => Promise<void>;
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
  setSubscriptions: async (subscriptions) => {
    set({ subscriptions });
    await persistSubscriptions(subscriptions);
  },
}));
