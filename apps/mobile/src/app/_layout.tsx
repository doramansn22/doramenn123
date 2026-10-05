import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplash();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: "#101010",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="ai" />
      <Stack.Screen name="services" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}