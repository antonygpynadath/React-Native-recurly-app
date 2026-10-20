import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="confirm-overlay" onPress={onCancel}>
        <Pressable className="confirm-container" onPress={(e) => e.stopPropagation()}>
          <Text className="confirm-title">{title}</Text>
          <Text className="confirm-message">{message}</Text>
          <View className="confirm-actions">
            <Pressable className="confirm-btn confirm-btn-cancel" onPress={onCancel}>
              <Text className="confirm-btn-text confirm-btn-cancel-text">{cancelLabel}</Text>
            </Pressable>
            <Pressable
              className={clsx("confirm-btn", destructive ? "confirm-btn-destructive" : "confirm-btn-primary")}
              onPress={onConfirm}
            >
              <Text className="confirm-btn-text">{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmDialog;
