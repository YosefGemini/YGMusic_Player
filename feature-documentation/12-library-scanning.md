# 12 · File access & library scanning

**Status:** Phase 2 · implemented and tested (core), verified on device

## Purpose
Discover the user's audio files and keep the SQLite library in sync
incrementally, regardless of how access was granted (chosen folder vs whole
device).

## Behavior
- **Access modes:** `saf` (folder picker), `mediastore` (whole device),
  `path` (future).
- **File listers** implement the `FileLister` port:
  - `SafFolderLister` — walks a granted folder recursively via
    `expo-file-system` `Directory`/`File` (Android SAF + iOS document picker).
  - `MediaStoreLister` — pages the whole-device audio library via
    `expo-media-library/legacy`.
- **Incremental scan:** each file's `(mtime, size)` is compared against
  `scan_cache`; unchanged files are skipped. New/changed files are parsed and
  upserted; disappeared files are removed (and their cache entry dropped).

## Files
- `src/core/files/{audioExtensions,folderTree,types}.ts` — extensions, folder
  tree builder, shared types.
- `src/core/files/listers/*` — SAF/MediaStore listers + folder picker.
- `src/core/library/{types,scanner,modules,services}.ts` — scan pipeline, ports,
  registry modules.
- `src/core/db/repositories/scanRepository.ts` — SQLite implementation of the
  scan persistence port (upserts artists/albums/tracks + cache).

## Ports (for testability)
`ScanRepository` (cache lookup/upsert, track upsert, list/delete by folder),
`FileLister`, `MetadataProvider`. The scanner depends only on these, so it is
unit-tested with fakes.

## Contracts
- `LibraryScanner.scanFolder(folder)` → `ScanSummary`
  `{ scanned, created, updated, skipped, removed, errors }`.
- Per-file failures increment `errors` and do not abort the scan.
- `scanFolders` aggregates summaries.

## Edge cases
- Empty folder → all zeros.
- Changed mtime/size → `updated`.
- Missing file → `removed` (+ cache delete).
- Tag/parse failure → `errors` and continue.

## Tests
- `src/core/files/__tests__/audioExtensions.test.ts`, `folderTree.test.ts`.
- `src/core/library/__tests__/scanner.test.ts` — create/skip/update/remove/
  error/aggregate with fakes.
- `src/core/library/__tests__/modules.test.ts` — services + registry modules.

## Verified on device
Tapping **Scan device library** inserted a "Device library" folder live and
completed a scan (`Added 0, updated 0, removed 0, skipped 0` on the empty
emulator) — exercising MediaStore → scanner → SQLite → live UI.

## Pending
Recursive SAF tree persistence across app restarts; native tag reader;
background/worker scanning for very large libraries.
