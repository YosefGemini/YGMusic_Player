import React from "react";

import { EmptyState, Screen, ScreenHeader } from "@/shared/ui";

export default function PlaylistsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Playlists" subtitle="Your own collections" />
      <EmptyState
        icon="list"
        title="No playlists yet"
        description="Create a playlist and add a cover image from your photos."
      />
    </Screen>
  );
}
