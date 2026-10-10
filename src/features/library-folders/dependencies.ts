import { Platform } from "react-native";

import { db } from "@/core/db/client";
import {
  createFoldersRepository,
  createScanRepository,
  createTracksRepository,
} from "@/core/db/repositories";
import { MediaStoreLister, SafFolderLister, SafFolderPicker } from "@/core/files/listers";
import { createLibraryServices, type LibraryScanner } from "@/core/library";
import { FilenameMetadataProvider } from "@/core/metadata";

export interface LibraryDependencies {
  folders: ReturnType<typeof createFoldersRepository>;
  tracks: ReturnType<typeof createTracksRepository>;
  scanner: LibraryScanner;
  /** Whole-device scanner (Android only); `null` elsewhere. */
  deviceScanner: LibraryScanner | null;
  picker: SafFolderPicker;
  metadataProvider: FilenameMetadataProvider;
}

let cached: LibraryDependencies | null = null;

/** Lazily builds the real (SQLite + native) library wiring. */
export function getLibraryDependencies(): LibraryDependencies {
  if (cached) return cached;

  const metadataProvider = new FilenameMetadataProvider();
  const repository = createScanRepository(db);
  const scanner = createLibraryServices({
    fileLister: new SafFolderLister(),
    metadataProvider,
    repository,
  }).scanner;

  const deviceScanner =
    Platform.OS === "android"
      ? createLibraryServices({
          fileLister: new MediaStoreLister(),
          metadataProvider,
          repository,
        }).scanner
      : null;

  cached = {
    folders: createFoldersRepository(db),
    tracks: createTracksRepository(db),
    scanner,
    deviceScanner,
    picker: new SafFolderPicker(),
    metadataProvider,
  };
  return cached;
}
