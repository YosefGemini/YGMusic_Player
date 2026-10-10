import React from "react";

import { EmptyState, Screen, ScreenHeader } from "@/shared/ui";

export default function SongsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Songs" subtitle="Every track in your library" />
      <EmptyState
        icon="musical-notes"
        title="No songs yet"
        description="Grant access to a folder or your device library to import your music."
      />
    </Screen>
  );
}
