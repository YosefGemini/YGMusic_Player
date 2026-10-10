import { Directory } from "expo-file-system";

import type { FolderPicker, FolderRef } from "../types";

/** Opens the system directory picker and returns the granted folder. */
export class SafFolderPicker implements FolderPicker {
  async pickFolder(): Promise<FolderRef | null> {
    try {
      const directory = await Directory.pickDirectoryAsync();
      return {
        uri: directory.uri,
        name: directory.name,
        parentUri: null,
        accessMode: "saf",
      };
    } catch {
      // The user cancelled or access was denied.
      return null;
    }
  }
}
