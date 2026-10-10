import { Ionicons } from "./icons";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

import { cn } from "@/shared/utils/cn";

export interface AlbumArtProps {
  uri?: string | null;
  /** Square size in points. */
  size?: number;
  /** `full` for circular art, `md` for soft corners. */
  rounded?: "none" | "md" | "full";
  /** Render a vinyl-record edge (outer ring + inner label) around the art. */
  disc?: boolean;
  className?: string;
}

const ROUNDED_CLASS = {
  none: "rounded-none",
  md: "rounded-theme",
  full: "rounded-full",
} as const;

/** Album cover with graceful fallback and an optional vinyl "disc" frame. */
export function AlbumArt({
  uri,
  size = 56,
  rounded = "md",
  disc = false,
  className,
}: AlbumArtProps) {
  const art = (
    <View
      className={cn(
        "items-center justify-center overflow-hidden bg-surface-elevated",
        ROUNDED_CLASS[disc ? "full" : rounded],
        className,
      )}
      style={{ width: size, height: size }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <Ionicons name="musical-notes" size={size * 0.4} className="text-muted" />
      )}
    </View>
  );

  if (!disc) return art;

  return (
    <View className="items-center justify-center rounded-full border-4 border-surface">
      <View className="items-center justify-center rounded-full border-2 border-border">
        {art}
        <View className="absolute h-4 w-4 rounded-full border-2 border-background bg-surface-elevated" />
      </View>
    </View>
  );
}
