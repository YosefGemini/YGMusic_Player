import type { ScannedFile } from "@/core/files";

import { parseAudioFilename } from "../parseFilename";
import type { MetadataProvider, TrackMetadata } from "../types";

/**
 * Pure, dependency-free metadata provider. Derives title/artist/track number
 * from the file name. Used as the default until a native tag reader is wired in
 * behind the same interface (Phase 2+).
 */
export class FilenameMetadataProvider implements MetadataProvider {
  async readMetadata(file: ScannedFile): Promise<TrackMetadata> {
    const parsed = parseAudioFilename(file.fileName);
    return {
      title: parsed.title,
      artist: parsed.artist,
      trackNo: parsed.trackNo,
    };
  }
}
