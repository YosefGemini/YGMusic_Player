import React from "react";

import { EmptyState, Screen, ScreenHeader } from "@/shared/ui";

export default function AlbumsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Albums" subtitle="Cover art carousel" />
      <EmptyState
        icon="albums"
        title="No albums yet"
        description="Albums appear once your library has been scanned."
      />
    </Screen>
  );
}
