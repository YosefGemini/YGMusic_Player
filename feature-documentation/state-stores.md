# Feature: State stores (Zustand)

**Status:** Phase 1 · implemented and tested

## Purpose
Hold ephemeral app state — playback control and user settings — separate from
persistent data (SQLite). Stores are framework-light and easy to test.

## Stores

### `playerStore`
Wraps a `PlayerQueue` and mirrors its derived fields into state so React
re-renders on every change.

- State: `queue`, `currentTrackId`, `currentIndex`, `isPlaying`, `repeat`,
  `shuffle`, `position`, `duration`.
- Actions: `setQueue`, `clearQueue`, `play`, `pause`, `togglePlay`, `next`,
  `previous`, `cycleRepeat`, `toggleShuffle`, `jumpTo`, `setPosition`,
  `setDuration`.
- `setQueue` preserves the current repeat/shuffle modes.

### `settingsStore`
- State: `themeId`, `libraryMode` (`"folder" | "device"`).
- Actions: `setThemeId`, `setLibraryMode`, `reset`.

## Files
- `src/store/playerStore.ts` — `createPlayerStore()` factory + `usePlayerStore`.
- `src/store/settingsStore.ts` — `createSettingsStore()` + `useSettingsStore`.
- `src/store/index.ts` — public surface.

Factories (`create*Store`) exist so each test gets an isolated instance.

## Edge cases
- Position clamps to `>= 0`; duration clamps to `>= 0`.
- An empty queue yields `currentTrackId = null`, `currentIndex = -1`.
- `clearQueue` also stops playback.

## Pending
Persistence of settings/themes to the `settings` table (Phase 2), and wiring
`playerStore` to the real `PlayerEngine` (Phase 4).

## Tests
- `src/store/__tests__/playerStore.test.ts` — queue/derived state, playback
  toggles, next/prev, repeat/shuffle, mode preservation, jump/clamping, clear.
- `src/store/__tests__/settingsStore.test.ts` — defaults, updates, reset.
