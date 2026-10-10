import { Ionicons } from "./icons";
import React, { type ReactNode } from "react";
import { Text, View } from "react-native";

/** Empty/placeholder state for screens with no content yet. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name={icon} size={48} className="text-muted" />
      <View className="mt-4 items-center">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        {description ? (
          <Text className="mt-2 text-center text-sm text-muted">{description}</Text>
        ) : null}
      </View>
      {action ? <View className="mt-5">{action}</View> : null}
    </View>
  );
}
