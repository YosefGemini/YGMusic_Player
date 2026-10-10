# Feature: Navigation shell

**Status:** Phase 1 · implemented and verified on device

## Purpose
Give the app its structure: a tabbed library with a settings surface, using
Expo Router (routes live in `src/app`).

## Behavior
- Bottom tabs: **Songs, Artists, Albums, Folders, Playlists** (Ionicons, themed
  via the active theme).
- A root stack hosts `(tabs)`, a modal `settings`, and the `spike` dev screen.
- Each tab screen shows a themed header (with a settings shortcut) and an
  empty state until its data source lands.

## Files
- `src/app/_layout.tsx` — root: `SafeAreaProvider` → `ThemeProvider` →
  `DatabaseProvider` → `Stack`.
- `src/app/(tabs)/_layout.tsx` — the `Tabs` navigator with per-tab icons.
- `src/app/(tabs)/index.tsx` — Songs.
- `src/app/(tabs)/artists.tsx`, `albums.tsx`, `folders.tsx`, `playlists.tsx`.
- `src/app/settings.tsx` — settings modal (see `settings.md`).
- `src/app/spike.tsx` — developer engine checks.

## Contracts
- Keep route files thin; feature logic lives in `src/features` / `core`.
- Tab-bar colors come from the active theme via `tripletToColor` (native tab
  options can't use CSS variables).

## Verified on device
Tab switching works; each screen renders with themed icons and the settings
gear opens the modal.

## Pending
Nested stacks per tab (artist/album detail), and a now-playing modal (Phase 4).
