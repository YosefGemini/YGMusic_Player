import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, Text, View } from "react-native";

import { toScannableFolder, type FolderRecord } from "@/core/db/repositories";
import { Screen, ScreenHeader, EmptyState, Button } from "@/shared/ui";
import { Ionicons } from "@/shared/ui/icons";
import { useSettingsStore } from "@/store/settingsStore";

import { getLibraryDependencies } from "./dependencies";
import { useFolderTrackCounts, useFolders } from "./useFolders";

const ACCESS_LABEL: Record<FolderRecord["accessMode"], string> = {
  saf: "Folder",
  mediastore: "Device library",
  path: "Path",
};

export function FoldersScreen() {
  const folders = useFolders();
  const counts = useFolderTrackCounts();
  const libraryMode = useSettingsStore((state) => state.libraryMode);
  const deps = useMemo(() => getLibraryDependencies(), []);
  const [busyId, setBusyId] = useState<string | null>(null);

  const addFolder = useCallback(async () => {
    const picked = await deps.picker.pickFolder();
    if (!picked) return;
    const row = await deps.folders.add({
      uri: picked.uri,
      name: picked.name,
      accessMode: picked.accessMode,
    });
    Alert.alert("Folder added", `“${row.name}” is ready to scan.`);
  }, [deps]);

  const scanFolder = useCallback(
    async (folder: FolderRecord) => {
      setBusyId(folder.id);
      try {
        const summary = await deps.scanner.scanFolder(toScannableFolder(folder));
        Alert.alert(
          "Scan complete",
          `Added ${summary.created}, updated ${summary.updated}, removed ${summary.removed}, skipped ${summary.skipped}.`,
        );
      } catch (error) {
        Alert.alert("Scan failed", String(error));
      } finally {
        setBusyId(null);
      }
    },
    [deps],
  );

  const scanDevice = useCallback(async () => {
    if (!deps.deviceScanner) return;
    const folder = await deps.folders.add({
      uri: "mediastore://audio",
      name: "Device library",
      accessMode: "mediastore",
    });
    await scanFolder(folder);
  }, [deps, scanFolder]);

  const removeFolder = useCallback(
    (folder: FolderRecord) => {
      Alert.alert("Remove folder", `Stop reading “${folder.name}”?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => void deps.folders.remove(folder.id),
        },
      ]);
    },
    [deps],
  );

  return (
    <Screen>
      <ScreenHeader title="Folders" subtitle="Only the folders you allow" />

      {libraryMode === "device" && deps.deviceScanner ? (
        <View className="mb-4 rounded-theme border border-border bg-surface p-4">
          <Text className="text-base font-semibold text-foreground">
            Whole device
          </Text>
          <Text className="mt-1 text-xs text-muted">
            Scan every audio file the system reports.
          </Text>
          <Button
            label="Scan device library"
            variant="accent"
            className="mt-3 self-start"
            onPress={scanDevice}
          />
        </View>
      ) : null}

      {folders.length === 0 ? (
        <EmptyState
          icon="folder-open-outline"
          title="No folders added"
          description="Add a folder to control exactly what the app can read."
          action={<Button label="Add folder" onPress={addFolder} />}
        />
      ) : (
        <View className="gap-3">
          {folders.map((folder) => (
            <View
              key={folder.id}
              className="flex-row items-center gap-3 rounded-theme border border-border bg-surface p-3"
            >
              <Ionicons name="folder" size={22} className="text-muted" />
              <View className="flex-1">
                <Text className="text-base text-foreground" numberOfLines={1}>
                  {folder.name}
                </Text>
                <Text className="mt-0.5 text-xs text-muted">
                  {ACCESS_LABEL[folder.accessMode]} · {counts[folder.id] ?? 0} tracks
                </Text>
              </View>
              {busyId === folder.id ? (
                <ActivityIndicator />
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Scan ${folder.name}`}
                  onPress={() => scanFolder(folder)}
                  className="h-9 w-9 items-center justify-center rounded-full bg-surface-elevated active:opacity-80"
                >
                  <Ionicons name="refresh" size={18} className="text-primary" />
                </Pressable>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${folder.name}`}
                onPress={() => removeFolder(folder)}
                className="h-9 w-9 items-center justify-center rounded-full bg-surface-elevated active:opacity-80"
              >
                <Ionicons name="trash-outline" size={18} className="text-muted" />
              </Pressable>
            </View>
          ))}

          <Button
            label="Add folder"
            variant="secondary"
            className="mt-1 self-start"
            onPress={addFolder}
          />
          {Platform.OS !== "android" ? (
            <Text className="mt-2 text-xs text-muted">
              Whole-device scanning is available on Android.
            </Text>
          ) : null}
        </View>
      )}
    </Screen>
  );
}
