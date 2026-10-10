import type { ScannedFile } from "@/core/files";

/** Normalized metadata for a track, regardless of its source. */
export interface TrackMetadata {
  title: string;
  artist?: string;
  album?: string;
  durationMs?: number;
  trackNo?: number;
  discNo?: number;
  year?: number;
  genre?: string;
  artworkUri?: string;
}

/**
 * Reads metadata for a discovered file. Implementations may parse tags (native)
 * or derive values from the path (pure fallback).
 */
export interface MetadataProvider {
  readMetadata(file: ScannedFile): Promise<TrackMetadata>;
}
