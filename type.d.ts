import type { IconKey } from "@/constants/icons";
import type { ImageSourcePropType } from "react-native";

declare global {
  interface AppTab {
    name: string;
    title: string;
    icon: ImageSourcePropType;
  }

  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
  }

  interface Subscription {
    id: string;
    icon: IconKey;
    name: string;
    plan?: string;
    category?: string;
    paymentMethod?: string;
    startDate?: string;
    price: number;
    currency?: string;
    billing: string;
    frequency?: string;
    renewalDate?: string;
    color?: string;
  }

  interface SubscriptionCardProps extends Omit<Subscription, "id"> {
    expanded: boolean;
    onPress: () => void;
    onEditPress?: () => void;
    onDeletePress?: () => void;
    onRenewPress?: () => void;
  }

  interface UpcomingSubscription {
    id: string;
    icon: IconKey;
    name: string;
    price: number;
    currency?: string;
    daysLeft: number;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface UpcomingSubscriptionCardProps extends Omit<UpcomingSubscription, "id"> {}

  type SubscriptionListFilter = "all" | "upcoming" | "pending";

  interface ListHeadingProps {
    title: string;
    onViewAllPress?: () => void;
  }
}

export {};
