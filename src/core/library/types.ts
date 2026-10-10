import type { FileLister, ScannableFolder, ScannedFile } from "@/core/files";
import type { MetadataProvider, TrackMetadata } from "@/core/metadata";

/** A track discovered during a scan, ready to be persisted. */
export interface TrackUpsert {
  file: ScannedFile;
  metadata: TrackMetadata;
  folderId: string;
}

/** Cache entry that lets us skip re-parsing unchanged files. */
export interface ScanCacheEntry {
  uri: string;
  folderId: string;
  mtimeMs: number;
  sizeBytes: number;
}

export interface ScanCacheLookup {
  mtimeMs: number;
  sizeBytes: number;
}

/**
 * Persistence port used by the scanner. Keeping it an interface lets the scan
 * pipeline be unit-tested with a fake and implemented with SQLite in the app.
 */
export interface ScanRepository {
  getScanCacheEntry(uri: string): Promise<ScanCacheLookup | null>;
  upsertScanCache(entry: ScanCacheEntry): Promise<void>;
  deleteScanCache(uri: string): Promise<void>;
  upsertTrack(input: TrackUpsert): Promise<"created" | "updated">;
  listTrackUrisInFolder(folderId: string): Promise<string[]>;
  deleteTrackByUri(uri: string): Promise<void>;
}

export interface LibraryScannerDeps {
  fileLister: FileLister;
  metadataProvider: MetadataProvider;
  repository: ScanRepository;
}

export interface ScanSummary {
  scanned: number;
  created: number;
  updated: number;
  skipped: number;
  removed: number;
  errors: number;
}

export function emptyScanSummary(): ScanSummary {
  return { scanned: 0, created: 0, updated: 0, skipped: 0, removed: 0, errors: 0 };
}

export interface LibraryServices {
  scanner: import("./scanner").LibraryScanner;
}

export type { FileLister, ScannableFolder };
