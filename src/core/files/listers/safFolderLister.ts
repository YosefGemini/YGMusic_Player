import { Directory, File } from "expo-file-system";

import { extensionOf, isAudioFileName } from "../audioExtensions";
import type { FileLister, FolderRef, ScannedFile } from "../types";

export interface SafFolderListerOptions {
  /** How deep to descend into subdirectories (default 8). */
  maxDepth?: number;
}

/**
 * Lists audio files under a folder granted through the Storage Access Framework
 * (Android) or the document picker (iOS), recursing into subdirectories.
 */
export class SafFolderLister implements FileLister {
  constructor(private readonly options: SafFolderListerOptions = {}) {}

  async listAudioFiles(folder: FolderRef): Promise<ScannedFile[]> {
    const out: ScannedFile[] = [];
    const maxDepth = this.options.maxDepth ?? 8;
    await this.walk(new Directory(folder.uri), folder.uri, maxDepth, out);
    return out;
  }

  private async walk(
    directory: Directory,
    rootUri: string,
    depth: number,
    out: ScannedFile[],
  ): Promise<void> {
    if (depth < 0) return;
    let entries: (Directory | File)[];
    try {
      entries = directory.list();
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry instanceof Directory) {
        await this.walk(entry, rootUri, depth - 1, out);
      } else {
        this.pushFile(entry, rootUri, out);
      }
    }
  }

  private pushFile(file: File, rootUri: string, out: ScannedFile[]): void {
    if (!isAudioFileName(file.name)) return;
    let sizeBytes = 0;
    let mtimeMs = 0;
    try {
      const info = file.info();
      sizeBytes = info.size ?? 0;
      mtimeMs = info.modificationTime ?? 0;
    } catch {
      // file may be unreadable; still keep a zeroed entry so it can be retried
    }
    out.push({
      uri: file.uri,
      fileName: file.name,
      extension: extensionOf(file.name),
      sizeBytes,
      mtimeMs,
      parentFolderUri: rootUri,
    });
  }
}
