import { Ionicons } from "@/shared/ui/icons";
import { Link, router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/core/theme/ThemeProvider";
import { Screen } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { useSettingsStore, type LibraryMode } from "@/store/settingsStore";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-7">
      <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
        {title}
      </Text>
      <View className="overflow-hidden rounded-theme border border-border bg-surface">
        {children}
      </View>
    </View>
  );
}

function SelectRow({
  icon,
  title,
  description,
  selected,
  onPress,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-3 px-4 py-3.5 active:opacity-80",
        !last && "border-b border-border",
      )}
    >
      <Ionicons name={icon} size={20} className="text-muted" />
      <View className="flex-1">
        <Text className="text-base text-foreground">{title}</Text>
        {description ? (
          <Text className="mt-0.5 text-xs text-muted">{description}</Text>
        ) : null}
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={22} className="text-primary" />
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { theme, themes, setThemeId } = useTheme();
  const libraryMode = useSettingsStore((state) => state.libraryMode);
  const setLibraryMode = useSettingsStore((state) => state.setLibraryMode);

  const libraryOptions: {
    mode: LibraryMode;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
  }[] = [
    {
      mode: "device",
      icon: "phone-portrait-outline",
      title: "Whole device",
      description: "Scan all audio files on this device",
    },
    {
      mode: "folder",
      icon: "folder-outline",
      title: "Selected folders only",
      description: "You choose exactly which folders are readable",
    },
  ];

  return (
    <Screen scroll>
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-foreground">Settings</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface active:opacity-80"
        >
          <Ionicons name="close" size={20} className="text-foreground" />
        </Pressable>
      </View>

      <Section title="Appearance">
        {themes.map((candidate, index) => (
          <SelectRow
            key={candidate.id}
            icon="color-palette-outline"
            title={candidate.name}
            description={candidate.description}
            selected={candidate.id === theme.id}
            onPress={() => setThemeId(candidate.id)}
            last={index === themes.length - 1}
          />
        ))}
      </Section>

      <Section title="Music access">
        {libraryOptions.map((option, index) => (
          <SelectRow
            key={option.mode}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={libraryMode === option.mode}
            onPress={() => setLibraryMode(option.mode)}
            last={index === libraryOptions.length - 1}
          />
        ))}
      </Section>

      <Section title="Developer">
        <Link href="/spike" asChild>
          <Pressable
            accessibilityRole="button"
            className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-80"
          >
            <Ionicons name="pulse-outline" size={20} className="text-muted" />
            <Text className="flex-1 text-base text-foreground">Engine checks</Text>
            <Ionicons name="chevron-forward" size={18} className="text-muted" />
          </Pressable>
        </Link>
      </Section>

      <Text className="mb-10 text-center text-xs text-muted">
        YGMusic Player · offline · ad-free
      </Text>
    </Screen>
  );
}
