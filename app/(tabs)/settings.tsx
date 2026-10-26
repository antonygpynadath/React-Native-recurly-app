import images from "@/constants/images";
import { useThemeStore } from "@/zustand/themeStore";
import { useClerk, useUser } from "@clerk/expo";
import { Image, Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { posthog, posthogLog } from "../../lib/posthog";

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleSignOut = async () => {
    try {
      await signOut();
      posthog?.capture("user_signed_out");
      posthogLog.info("user_signed_out");
      posthog?.reset();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  const displayName =
    user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || "User";
  const email = user?.emailAddresses[0]?.emailAddress;
  const isDark = theme === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary mb-6">Settings</Text>

      {/* User Profile Section */}
      <View className="auth-card mb-5">
        <View className="flex-row items-center gap-4 mb-4">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="size-16 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-lg font-sans-bold text-primary">{displayName}</Text>
            {email && (
              <Text className="text-sm font-sans-medium text-muted-foreground">{email}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Appearance Section */}
      <View className="auth-card mb-5">
        <Text className="text-base font-sans-semibold text-primary mb-3">Appearance</Text>
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-sm font-sans-medium text-muted-foreground">Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={(enabled) => setTheme(enabled ? "dark" : "light")}
            trackColor={{ false: "#f6eecf", true: "#ea7a53" }}
            thumbColor="#fff9e3"
          />
        </View>
      </View>

      {/* Account Section */}
      <View className="auth-card mb-5">
        <Text className="text-base font-sans-semibold text-primary mb-3">Account</Text>
        <View className="gap-2">
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-sm font-sans-medium text-muted-foreground">Account ID</Text>
            <Text
              className="text-sm font-sans-medium text-primary"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user?.id?.substring(0, 20)}...
            </Text>
          </View>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-sm font-sans-medium text-muted-foreground">Joined</Text>
            <Text className="text-sm font-sans-medium text-primary">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Sign Out Button */}
      <Pressable className="auth-button bg-destructive" onPress={handleSignOut}>
        <Text className="auth-button-text text-white">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
