import { ROUTES } from "@/constants/routes";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for the auth state to be loaded before rendering the layout
  if (!isLoaded) {
    return null;
  }

  // If the user is signed in, redirect to the tabs screen
  if (isSignedIn) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
