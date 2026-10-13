import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">Welcome to NativeWind</Text>
      <Link href="/onboarding" className="mt-4 rounded-md bg-primary p-4 text-white">Go to Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded-md bg-primary p-4 text-white">Go to Signin</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded-md bg-primary p-4 text-white">Go to Signup</Link>
    <Link href="/subscriptions/spotify" className="mt-4 rounded-md bg-primary p-4 text-white">Go to Spotify Subscription</Link>
    <Link href="/settings" className="mt-4 rounded-md bg-primary p-4 text-white">Go to Settings</Link>
    <Link href={{ pathname: "/subscriptions/[id]", params: { id: "claude" }}} className="mt-4 rounded-md bg-primary p-4 text-white">Claude Subscription</Link>

    

    </View>
  );
}
