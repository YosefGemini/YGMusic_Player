import { Ionicons } from "./icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

/** Large, themed screen title with an optional settings shortcut. */
export function ScreenHeader({
  title,
  subtitle,
  showSettings = true,
}: {
  title: string;
  subtitle?: string;
  showSettings?: boolean;
}) {
  return (
    <View className="mb-5 flex-row items-start justify-between">
      <View className="flex-1">
        <Text className="text-3xl font-bold text-foreground">{title}</Text>
        {subtitle ? (
          <Text className="mt-1 text-sm text-muted">{subtitle}</Text>
        ) : null}
      </View>
      {showSettings ? (
        <Link href="/settings" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            className="h-10 w-10 items-center justify-center rounded-full bg-surface active:opacity-80"
          >
            <Ionicons name="settings-outline" size={20} className="text-foreground" />
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}
