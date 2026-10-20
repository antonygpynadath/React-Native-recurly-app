import { DEFAULT_SUBSCRIPTION_ICON } from "@/constants/icons";
import { posthog, posthogLog } from "@/lib/posthog";
import React, { useMemo } from "react";
import { isCategory, isFrequency, parsePaymentMethod } from "./constants";
import SubscriptionFormModal, {
  DEFAULT_FORM_VALUES,
  type SubscriptionFormValues,
} from "./SubscriptionFormModal";

interface EditSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onSubmit: (subscription: Subscription) => void;
}

const EditSubscriptionModal = ({
  visible,
  onClose,
  subscription,
  onSubmit,
}: EditSubscriptionModalProps) => {
  const initialValues = useMemo(() => {
    if (!subscription) return DEFAULT_FORM_VALUES;

    const { paymentType, cardNumber } = parsePaymentMethod(subscription.paymentMethod);

    return {
      name: subscription.name,
      price: String(subscription.price),
      frequency: isFrequency(subscription.frequency)
        ? subscription.frequency
        : isFrequency(subscription.billing)
          ? subscription.billing
          : DEFAULT_FORM_VALUES.frequency,
      category: isCategory(subscription.category)
        ? subscription.category
        : DEFAULT_FORM_VALUES.category,
      icon: subscription.icon ?? DEFAULT_SUBSCRIPTION_ICON,
      startDate: subscription.startDate ? new Date(subscription.startDate) : new Date(),
      paymentType,
      cardNumber,
    };
  }, [subscription]);

  if (!subscription) return null;

  const handleSubmit = (values: SubscriptionFormValues) => {
    const updatedSubscription: Subscription = {
      ...subscription,
      name: values.name,
      price: values.price,
      frequency: values.frequency,
      category: values.category,
      startDate: values.startDate,
      renewalDate: values.renewalDate,
      icon: values.icon,
      billing: values.billing,
      color: values.color,
      paymentMethod: values.paymentMethod,
    };

    onSubmit(updatedSubscription);

    posthog?.capture("subscription_updated", {
      subscription_id: subscription.id,
      subscription_name: values.name,
      subscription_price: values.price,
      subscription_frequency: values.frequency,
      subscription_category: values.category,
    });

    posthogLog.info("subscription_updated", {
      subscription_id: subscription.id,
      subscription_name: values.name,
      subscription_price: values.price,
      subscription_frequency: values.frequency,
      subscription_category: values.category,
    });
  };

  return (
    <SubscriptionFormModal
      visible={visible}
      onClose={onClose}
      title="Edit Subscription"
      submitLabel="Save Changes"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
};

export default EditSubscriptionModal;
