import type { ScannableFolder } from "@/core/files";

import {
  emptyScanSummary,
  type LibraryScannerDeps,
  type ScanSummary,
} from "./types";

function addSummary(target: ScanSummary, source: ScanSummary): void {
  target.scanned += source.scanned;
  target.created += source.created;
  target.updated += source.updated;
  target.skipped += source.skipped;
  target.removed += source.removed;
  target.errors += source.errors;
}

/**
 * Incremental library scanner.
 *
 * For each audio file it compares the cached (mtime, size) pair from
 * `scan_cache`; unchanged files are skipped entirely. New/changed files are
 * parsed and upserted. Files that disappeared are removed (with their cache
 * entry), so the library stays in sync without a full re-parse.
 */
export class LibraryScanner {
  constructor(private readonly deps: LibraryScannerDeps) {}

  async scanFolder(folder: ScannableFolder): Promise<ScanSummary> {
    const summary = emptyScanSummary();
    const files = await this.deps.fileLister.listAudioFiles(folder);
    const seen = new Set<string>();

    for (const file of files) {
      summary.scanned += 1;
      seen.add(file.uri);
      try {
        const cached = await this.deps.repository.getScanCacheEntry(file.uri);
        if (
          cached &&
          cached.mtimeMs === file.mtimeMs &&
          cached.sizeBytes === file.sizeBytes
        ) {
          summary.skipped += 1;
          continue;
        }

        const metadata = await this.deps.metadataProvider.readMetadata(file);
        const result = await this.deps.repository.upsertTrack({
          file,
          metadata,
          folderId: folder.id,
        });
        if (result === "created") summary.created += 1;
        else summary.updated += 1;

        await this.deps.repository.upsertScanCache({
          uri: file.uri,
          folderId: folder.id,
          mtimeMs: file.mtimeMs,
          sizeBytes: file.sizeBytes,
        });
      } catch {
        summary.errors += 1;
      }
    }

    const known = await this.deps.repository.listTrackUrisInFolder(folder.id);
    for (const uri of known) {
      if (seen.has(uri)) continue;
      await this.deps.repository.deleteTrackByUri(uri);
      await this.deps.repository.deleteScanCache(uri);
      summary.removed += 1;
    }

    return summary;
  }

  async scanFolders(folders: readonly ScannableFolder[]): Promise<ScanSummary> {
    const total = emptyScanSummary();
    for (const folder of folders) {
      addSummary(total, await this.scanFolder(folder));
    }
    return total;
  }
}
