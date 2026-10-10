import type { FileLister, ScannableFolder, ScannedFile } from "@/core/files";
import type { MetadataProvider, TrackMetadata } from "@/core/metadata";

import { LibraryScanner } from "../scanner";
import type { ScanCacheEntry, ScanRepository, TrackUpsert } from "../types";

const folder: ScannableFolder = {
  id: "folder-1",
  uri: "file:///music",
  name: "music",
  parentUri: null,
  accessMode: "saf",
};

function file(name: string, mtimeMs = 1000, sizeBytes = 10): ScannedFile {
  return {
    uri: `file:///music/${name}`,
    fileName: name,
    extension: name.split(".").pop() ?? "",
    sizeBytes,
    mtimeMs,
    parentFolderUri: folder.uri,
  };
}

class FakeLister implements FileLister {
  files: ScannedFile[] = [];
  async listAudioFiles(): Promise<ScannedFile[]> {
    return this.files;
  }
}

class FakeMetadata implements MetadataProvider {
  failOn: string | null = null;
  async readMetadata(target: ScannedFile): Promise<TrackMetadata> {
    if (this.failOn && target.fileName === this.failOn) {
      throw new Error("bad tag");
    }
    return { title: target.fileName.replace(/\.[^.]+$/, "") };
  }
}

class FakeRepo implements ScanRepository {
  cache = new Map<string, ScanCacheEntry>();
  tracks = new Map<string, string>(); // uri -> folderId
  upserts: TrackUpsert[] = [];

  async getScanCacheEntry(uri: string) {
    const entry = this.cache.get(uri);
    return entry ? { mtimeMs: entry.mtimeMs, sizeBytes: entry.sizeBytes } : null;
  }
  async upsertScanCache(entry: ScanCacheEntry) {
    this.cache.set(entry.uri, entry);
  }
  async deleteScanCache(uri: string) {
    this.cache.delete(uri);
  }
  async upsertTrack(input: TrackUpsert) {
    this.upserts.push(input);
    const existed = this.tracks.has(input.file.uri);
    this.tracks.set(input.file.uri, input.folderId);
    return existed ? "updated" : "created";
  }
  async listTrackUrisInFolder(folderId: string) {
    return [...this.tracks.entries()]
      .filter(([, id]) => id === folderId)
      .map(([uri]) => uri);
  }
  async deleteTrackByUri(uri: string) {
    this.tracks.delete(uri);
  }
}

function makeScanner() {
  const lister = new FakeLister();
  const metadata = new FakeMetadata();
  const repository = new FakeRepo();
  const scanner = new LibraryScanner({ fileLister: lister, metadataProvider: metadata, repository });
  return { lister, metadata, repository, scanner };
}

describe("LibraryScanner", () => {
  it("creates new tracks on the first scan", async () => {
    const { lister, repository, scanner } = makeScanner();
    lister.files = [file("a.mp3"), file("b.mp3")];

    const summary = await scanner.scanFolder(folder);
    expect(summary).toMatchObject({ scanned: 2, created: 2, updated: 0, removed: 0 });
    expect(repository.tracks.size).toBe(2);
    expect(repository.upserts[0].metadata.title).toBe("a");
  });

  it("skips unchanged files on rescan", async () => {
    const { lister, scanner } = makeScanner();
    lister.files = [file("a.mp3")];
    await scanner.scanFolder(folder);

    const second = await scanner.scanFolder(folder);
    expect(second).toMatchObject({ scanned: 1, created: 0, updated: 0, skipped: 1 });
  });

  it("updates files whose mtime or size changed", async () => {
    const { lister, scanner } = makeScanner();
    lister.files = [file("a.mp3", 1000, 10)];
    await scanner.scanFolder(folder);

    lister.files = [file("a.mp3", 2000, 10)];
    const summary = await scanner.scanFolder(folder);
    expect(summary.updated).toBe(1);
  });

  it("removes tracks whose files disappeared", async () => {
    const { lister, repository, scanner } = makeScanner();
    lister.files = [file("a.mp3"), file("b.mp3")];
    await scanner.scanFolder(folder);

    lister.files = [file("a.mp3")];
    const summary = await scanner.scanFolder(folder);
    expect(summary.removed).toBe(1);
    expect(repository.tracks.size).toBe(1);
    expect(repository.cache.has("file:///music/b.mp3")).toBe(false);
  });

  it("counts metadata failures and continues", async () => {
    const { lister, metadata, scanner } = makeScanner();
    metadata.failOn = "bad.mp3";
    lister.files = [file("bad.mp3"), file("good.mp3")];

    const summary = await scanner.scanFolder(folder);
    expect(summary.errors).toBe(1);
    expect(summary.created).toBe(1);
  });

  it("aggregates summaries across folders", async () => {
    const { lister, scanner } = makeScanner();
    lister.files = [file("a.mp3")];
    const other = { ...folder, id: "folder-2", uri: "file:///other" };
    const summary = await scanner.scanFolders([folder, other]);
    // same file list returned for both folders in this fake
    expect(summary.scanned).toBe(2);
    expect(summary.created + summary.updated + summary.skipped).toBe(2);
  });
});
