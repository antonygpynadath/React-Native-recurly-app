import { tabs } from "@/constants/data";
import { ROUTES } from "@/constants/routes";

import { components, getColors } from "@/constants/theme";
import { useThemeStore } from "@/lib/themeStore";
import { useAuth } from "@clerk/expo";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBar = components.tabBar;

const TabIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View className="tabs-icon">
      <View className={clsx("tabs-pill", focused && "tabs-active")}>
        <Image source={icon} resizeMode="contain" className="tabs-glyph" />
      </View>
    </View>
  );
};

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  const theme = useThemeStore((state) => state.theme);
  const colors = getColors(theme);

  // Wait for the auth state to be loaded before rendering the layout
  if (!isLoaded) {
    return null;
  }

  // If the user is not signed in, redirect to the sign-in screen
  if (!isSignedIn) {
    return <Redirect href={ROUTES.SIGN_IN} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.nav,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: "center",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={tab.icon} />,
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsLayout;
