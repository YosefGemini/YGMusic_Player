import * as MediaLibrary from "expo-media-library/legacy";

import { extensionOf } from "../audioExtensions";
import type { FileLister, ScannedFile } from "../types";

interface LegacyAudioAsset {
  uri: string;
  filename: string;
  modificationTime?: number;
}

/**
 * Lists the whole-device audio library via MediaStore (Android) / the media
 * library (iOS). Metadata is limited to what the platform exposes; tag parsing
 * happens later behind the `MetadataProvider`.
 */
export class MediaStoreLister implements FileLister {
  constructor(private readonly pageSize = 2000) {}

  async listAudioFiles(): Promise<ScannedFile[]> {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) return [];

    const out: ScannedFile[] = [];
    let after: string | undefined;
    // Page through the library so very large collections don't blow memory.
    for (let guard = 0; guard < 100; guard += 1) {
      const page = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: this.pageSize,
        after,
      });
      for (const asset of page.assets) {
        const file = asset as unknown as LegacyAudioAsset;
        out.push({
          uri: file.uri,
          fileName: file.filename,
          extension: extensionOf(file.filename),
          sizeBytes: 0,
          mtimeMs: file.modificationTime ?? 0,
          parentFolderUri: null,
        });
      }
      if (!page.hasNextPage) break;
      after = page.endCursor;
    }
    return out;
  }
}
