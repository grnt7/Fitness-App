import { View, ActivityIndicator } from "react-native";
import React from "react";
import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Layout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If not signed in → send to sign-in screen
  // if (!isSignedIn) {
  //   return <Redirect href="/sign-in" />;
  // }

  // Signed in → show main stack
  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="exercise-detail"
        options={{
          headerShown: false,
          presentation: "modal",
          gestureEnabled: true,
          // animation: "fade_from_bottom",
          animationTypeForReplace: "push",
        }}
      />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />

      </Stack.Protected>
    </Stack>
  );
};

export default Layout;
