import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DatabaseProvider } from "@/core/db/DatabaseProvider";
import { ThemeProvider } from "@/core/theme/ThemeProvider";
import { registerLibraryModules } from "@/features/library-folders";
import { useSettingsStore } from "@/store/settingsStore";

import "../../global.css";

export default function RootLayout() {
  const themeId = useSettingsStore((state) => state.themeId);
  const setThemeId = useSettingsStore((state) => state.setThemeId);

  useEffect(() => {
    registerLibraryModules();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider themeId={themeId} onThemeIdChange={setThemeId}>
        <DatabaseProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="settings" options={{ presentation: "modal" }} />
            <Stack.Screen name="spike" />
          </Stack>
        </DatabaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
