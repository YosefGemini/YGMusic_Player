import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, type ViewProps } from "react-native";

import { cn } from "@/shared/utils/cn";

export interface ScreenProps extends ViewProps {
  /** Wrap content in a vertical ScrollView. */
  scroll?: boolean;
  /** Apply default horizontal/vertical padding. */
  padded?: boolean;
  /** Include the bottom safe-area inset (kept off when a tab bar handles it). */
  edges?: ("top" | "bottom" | "left" | "right")[];
  contentContainerClassName?: string;
}

/** Standard screen container: themed background + safe area + optional scroll. */
export function Screen({
  children,
  className,
  scroll = false,
  padded = true,
  edges = ["top"],
  contentContainerClassName,
  ...rest
}: ScreenProps) {
  const padding = padded ? "px-5 py-4" : "";

  if (scroll) {
    return (
      <SafeAreaView edges={edges} className={cn("flex-1 bg-background", className)}>
        <ScrollView
          contentContainerClassName={cn(padding, contentContainerClassName)}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} className={cn("flex-1 bg-background", className)} {...rest}>
      <View className={cn("flex-1", padding)}>{children}</View>
    </SafeAreaView>
  );
}
