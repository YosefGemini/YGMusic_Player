import React from "react";

import { EmptyState, Screen, ScreenHeader } from "@/shared/ui";

export default function FoldersScreen() {
  return (
    <Screen>
      <ScreenHeader title="Folders" subtitle="Only the folders you allow" />
      <EmptyState
        icon="folder"
        title="No folders added"
        description="Add a folder in Settings to control exactly what the app can read."
      />
    </Screen>
  );
}
