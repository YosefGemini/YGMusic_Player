import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import React, { type ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import migrations from "../../../drizzle/migrations";

import { db } from "./client";
import { migrationState } from "./migrationState";

/**
 * Runs Drizzle migrations before rendering the app and blocks on the result.
 * Migrations are bundled into the JS build via `babel-plugin-inline-import`.
 */
export function DatabaseProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);
  const state = migrationState({ success, error });

  if (state.status === "loading") {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background">
        <ActivityIndicator />
        <Text className="text-muted">Preparing your library…</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-center text-lg font-semibold text-foreground">
          Database error
        </Text>
        <Text className="text-center text-sm text-muted">{state.message}</Text>
      </View>
    );
  }

  return <>{children}</>;
}
