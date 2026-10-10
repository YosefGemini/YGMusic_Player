# 13 · Folder browsing

**Status:** Phase 2 · implemented and verified on device

## Purpose
Give the user explicit control over what the app can read: add folders, see how
many tracks each holds, rescan, or scan the whole device.

## Behavior
- Lists granted folders live from SQLite (Drizzle live queries), each with its
  access mode and live track count.
- **Add folder** opens the system directory picker (`Directory.pickDirectoryAsync`)
  and stores the grant.
- **Scan** (per folder) runs the incremental scanner and reports a summary.
- **Scan device library** (shown in `device` library mode on Android) adds a
  virtual MediaStore folder and scans the whole device.
- **Remove** deletes a folder from the library (cascades to its tracks).

## Files
- `src/features/library-folders/FoldersScreen.tsx` — the screen.
- `src/features/library-folders/dependencies.ts` — real wiring
  (`FoldersRepository`, scanner, picker, device scanner).
- `src/features/library-folders/useFolders.ts` — live folder + count queries.
- `src/features/library-folders/register.ts` — registers the metadata/scanner
  modules into the app registry.
- `src/app/(tabs)/folders.tsx` — thin route → `FoldersScreen`.

## Contracts
- Core stays free of feature imports; the feature composes `core` engines.
- `registerLibraryModules()` is idempotent and called from the root layout.

## Verified on device
- Folders screen renders with the device-mode card and empty state.
- **Add folder** opened the system picker (`com.google.android.documentsui`).
- **Scan device library** created the folder live and completed a scan.

## Pending
Subfolder drill-down UI (data via `buildFolderTree`), per-folder enable/disable,
and richer scan progress.
