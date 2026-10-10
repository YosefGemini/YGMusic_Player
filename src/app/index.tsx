import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BUILT_IN_EQ_PRESETS } from "@/core/audio/equalizer/presets";
import { PlayerQueue } from "@/core/audio/player/queue";
import { useTheme } from "@/core/theme/ThemeProvider";

const DEMO_TRACKS = ["Intro", "Neon Sky", "Midnight Drive", "Afterglow"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function Phase0SpikeScreen() {
  const { theme, themes, setThemeId } = useTheme();
  const [queue] = useState(() => new PlayerQueue(DEMO_TRACKS, 0));
  const [snapshot, setSnapshot] = useState(() => queue.getSnapshot());
  const [audioStatus, setAudioStatus] = useState("Not started");

  const flatPreset = useMemo(() => BUILT_IN_EQ_PRESETS[0], []);

  const refresh = (mutate: () => void) => {
    mutate();
    setSnapshot(queue.getSnapshot());
  };

  const runAudioSpike = async () => {
    setAudioStatus("Initializing native AudioContext…");
    try {
      const { PlayerEngine } = await import("@/core/audio/player/playerEngine");
      const engine = new PlayerEngine();
      setAudioStatus(
        `OK — audio context ready, ${engine.equalizer.bandCount} EQ bands wired to destination.`,
      );
      engine.dispose();
    } catch (error) {
      setAudioStatus(
        `Unavailable (needs a development build): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-5">
        <Text className="text-2xl font-bold text-foreground">YGMusic Player</Text>
        <Text className="mb-6 mt-1 text-sm text-muted">
          Phase 0 spike · core engines online
        </Text>

        <Section title="Theme engine (runtime tokens)">
          <View className="flex-row flex-wrap gap-2">
            {themes.map((candidate) => {
              const active = candidate.id === theme.id;
              return (
                <Pressable
                  key={candidate.id}
                  onPress={() => setThemeId(candidate.id)}
                  className={`rounded-full border px-4 py-2 ${
                    active
                      ? "border-primary bg-primary"
                      : "border-border bg-surface"
                  }`}
                >
                  <Text
                    className={`text-sm ${active ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {candidate.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={`Equalizer · ${flatPreset.gains.length} bands per preset`}>
          <View className="flex-row flex-wrap gap-2">
            {BUILT_IN_EQ_PRESETS.map((preset) => (
              <View
                key={preset.id}
                className="rounded-theme border border-border bg-surface px-3 py-2"
              >
                <Text className="text-sm text-foreground">{preset.name}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Queue engine (repeat / shuffle)">
          <View className="rounded-theme border border-border bg-surface p-4">
            <Text className="text-base text-foreground">
              Now playing: {snapshot.currentTrackId ?? "—"}
            </Text>
            <Text className="mt-1 text-xs text-muted">
              repeat: {snapshot.repeat} · shuffle: {String(snapshot.shuffle)}
            </Text>
            <View className="mt-4 flex-row flex-wrap gap-2">
              <Pressable
                className="rounded-full bg-surface-elevated px-4 py-2"
                onPress={() => refresh(() => queue.previous())}
              >
                <Text className="text-foreground">Prev</Text>
              </Pressable>
              <Pressable
                className="rounded-full bg-primary px-4 py-2"
                onPress={() => refresh(() => queue.next(true))}
              >
                <Text className="text-primary-foreground">Next</Text>
              </Pressable>
              <Pressable
                className="rounded-full bg-surface-elevated px-4 py-2"
                onPress={() => refresh(() => queue.cycleRepeat())}
              >
                <Text className="text-foreground">Repeat</Text>
              </Pressable>
              <Pressable
                className="rounded-full bg-surface-elevated px-4 py-2"
                onPress={() => refresh(() => queue.toggleShuffle())}
              >
                <Text className="text-foreground">Shuffle</Text>
              </Pressable>
            </View>
          </View>
        </Section>

        <Section title="Audio engine (background + notification + EQ)">
          <Pressable
            className="items-center rounded-theme bg-accent px-4 py-3"
            onPress={runAudioSpike}
          >
            <Text className="font-semibold text-background">
              Initialize native audio graph
            </Text>
          </Pressable>
          <Text className="mt-3 text-xs text-muted">{audioStatus}</Text>
        </Section>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
