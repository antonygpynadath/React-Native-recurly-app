import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-7xl font-sans-extrabold text-primary">Home</Text>
      <Text className="text-7xl font-bold text-primary">Home</Text>

      <Link href="/onboarding" className="mt-4 font-sans-bold rounded-md bg-primary p-4 text-white">Go to Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 font-sans-bold rounded-md bg-primary p-4 text-white">Go to Signin</Link>
      <Link href="/(auth)/sign-up" className="mt-4 font-sans-bold rounded-md bg-primary p-4 text-white">Go to Signup</Link>
      <Link href="/subscriptions/spotify" className="mt-4 font-sans-bold rounded-md bg-primary p-4 text-white">Go to Spotify Subscription</Link>
      <Link href="/settings" className="mt-4 font-sans-bold rounded-md bg-primary p-4 text-white">Go to Settings</Link>
      <Link href={{ pathname: "/subscriptions/[id]", params: { id: "claude" }}} className="mt-4 font-sans-bold rounded-md bg-primary p-4 text-white">Claude Subscription</Link>
    </SafeAreaView>
  );
}
