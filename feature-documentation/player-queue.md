# Feature: Player queue

**Status:** Phase 0 · implemented and tested

## Purpose
Model the playback order — repeat modes and shuffle — independently from any
audio or UI code, so behavior is deterministic and easy to test.

## Behavior
- **Repeat modes:** `off`, `all`, `one`.
  - `off`: stops at the end of the queue.
  - `all`: wraps to the first track.
  - `one`: repeats the current track on **auto-advance**; a manual "next" still
    advances.
- **Shuffle:** reorders playback while keeping the current track active.
- **Jump:** select any track by its index in the library.

## Files
`src/core/audio/player/queue.ts`

## Contracts
- `new PlayerQueue(trackIds, startIndex?, { repeat?, shuffle? })`.
- `next(manual?)` / `previous()` return the new index or `null` at the boundary.
- `cycleRepeat()` cycles off → all → one → off (for the transport button).
- `setShuffle` / `toggleShuffle`, `jumpTo(index)`, `getSnapshot()`.
- `order` is the playback order of indices; `cursor` is the position in `order`.
  Sequential playback uses the natural order with `cursor = startIndex`.

## Edge cases
- Empty library: `currentTrackId` is `null`, `cursor` is `-1`, navigation returns `null`.
- Enabling shuffle preserves the current track and all track indices.
- Disabling shuffle restores natural order while keeping the current track.

## Tests
`src/core/audio/player/__tests__/queue.test.ts` — start position, forward
advance + stop, repeat all wrap, repeat one (auto vs manual), previous +
wrap, repeat cycling, shuffle on/off preservation, jump, empty library.

## Verified on device
Tapping "Next" on the Phase 0 screen advanced "Intro" → "Neon Sky".
