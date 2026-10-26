import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";
import "../global.css";
import { posthog } from "../lib/posthog";
import { useNotifications } from "../lib/useNotifications";
import { useSubscriptionStore } from "../zustand/subscriptionStore";
import { useThemeStore } from "../zustand/themeStore";

SplashScreen.preventAutoHideAsync();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function RootLayoutContent() {
  const { isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const identifiedUserId = useRef<string | null>(null);
  const theme = useThemeStore((state) => state.theme);
  const themeHydrated = useThemeStore((state) => state.hydrated);
  const hydrateTheme = useThemeStore((state) => state.hydrate);
  const subscriptionsHydrated = useSubscriptionStore((state) => state.hydrated);
  const hydrateSubscriptions = useSubscriptionStore((state) => state.hydrate);

  useNotifications();

  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    hydrateTheme();
    hydrateSubscriptions();
  }, [hydrateTheme, hydrateSubscriptions]);

  useEffect(() => {
    if (fontsLoaded && authLoaded && themeHydrated && subscriptionsHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoaded, themeHydrated, subscriptionsHydrated]);

  useEffect(() => {
    if (!userLoaded) return;

    if (!user) {
      identifiedUserId.current = null;
      return;
    }

    if (identifiedUserId.current === user.id) return;

    posthog?.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress && {
          email: user.primaryEmailAddress.emailAddress,
        }),
        ...(user.fullName && { name: user.fullName }),
      },
    });
    identifiedUserId.current = user.id;
  }, [user, userLoaded]);

  if (!fontsLoaded || !authLoaded || !themeHydrated || !subscriptionsHydrated) return null;

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthog ? (
        <PostHogProvider client={posthog}>
          <RootLayoutContent />
        </PostHogProvider>
      ) : (
        <RootLayoutContent />
      )}
    </ClerkProvider>
  );
}
