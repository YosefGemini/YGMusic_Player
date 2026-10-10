import React from "react";

import { EmptyState, Screen, ScreenHeader } from "@/shared/ui";

export default function ArtistsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Artists" subtitle="Browse by performer" />
      <EmptyState
        icon="people"
        title="No artists yet"
        description="Artists appear once your library has been scanned."
      />
    </Screen>
  );
}
