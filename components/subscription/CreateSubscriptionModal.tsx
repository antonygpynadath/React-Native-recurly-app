import { posthog, posthogLog } from "@/lib/posthog";
import React, { useMemo } from "react";
import SubscriptionFormModal, {
  DEFAULT_FORM_VALUES,
  type SubscriptionFormValues,
} from "./SubscriptionFormModal";

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({ visible, onClose, onSubmit }: CreateSubscriptionModalProps) => {
  const initialValues = useMemo(
    () => ({
      ...DEFAULT_FORM_VALUES,
      startDate: new Date(),
    }),
    // Refresh defaults each time the modal opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible],
  );

  const handleSubmit = (values: SubscriptionFormValues) => {
    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: values.name,
      price: values.price,
      currency: "USD",
      frequency: values.frequency,
      category: values.category,
      startDate: values.startDate,
      renewalDate: values.renewalDate,
      icon: values.icon,
      billing: values.billing,
      color: values.color,
      paymentMethod: values.paymentMethod,
    };

    onSubmit(newSubscription);

    posthog?.capture("subscription_created", {
      subscription_name: values.name,
      subscription_price: values.price,
      subscription_frequency: values.frequency,
      subscription_category: values.category,
    });

    posthogLog.info("subscription_created", {
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
      title="New Subscription"
      submitLabel="Create Subscription"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateSubscriptionModal;
