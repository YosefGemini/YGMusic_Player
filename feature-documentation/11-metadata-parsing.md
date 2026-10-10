# 11 · Metadata parsing

**Status:** Phase 2 · implemented and tested

## Purpose
Turn a discovered file into normalized track metadata, behind a stable
interface, so the source (file-name fallback today, native tag reader later)
can change without touching the scanner.

## Behavior
- `TrackMetadata` normalizes title/artist/album/duration/track/disc/year/genre/
  artwork.
- `FilenameMetadataProvider` derives title, artist, and track number from the
  file name — no native dependency, fully unit-tested.
- `MetadataProvider` is the port; a future tag parser (ID3/FLAC/M4A) implements
  the same interface and is swapped via the module registry.

## File-name patterns handled
`Artist - Title.mp3` · `Artist - Album - Title.mp3` (first/last parts) ·
`01 - Title.flac` (track number) · `my_song.mp3` (underscores → spaces) ·
extension-less names.

## Files
- `src/core/metadata/types.ts` — `TrackMetadata`, `MetadataProvider`.
- `src/core/metadata/parseFilename.ts` — `parseAudioFilename`.
- `src/core/metadata/providers/filenameProvider.ts` — `FilenameMetadataProvider`.
- `src/core/metadata/index.ts`.

## Contracts
- `parseAudioFilename(fileName)` → `{ title, artist?, trackNo? }` (never throws;
  falls back to `"Unknown"`).
- `MetadataProvider.readMetadata(file: ScannedFile)` → `Promise<TrackMetadata>`.

## Tests
- `__tests__/parseFilename.test.ts` — all patterns + edge cases.
- `__tests__/filenameProvider.test.ts` — provider maps parsed values.

## Pending
Native tag parsing module implementing `MetadataProvider`.
