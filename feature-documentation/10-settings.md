# Feature: Settings

**Status:** Phase 1 · implemented and verified on device

## Purpose
Let the user control the two things they should own from the start: the app's
appearance and what music the app is allowed to read.

## Behavior
- **Appearance** — pick any theme (Midnight, OLED Black, Daylight). Changes
  apply instantly across the whole app and the tab bar.
- **Music access** — choose `Whole device` (MediaStore scan) or
  `Selected folders only` (SAF grants). Stored in `settingsStore.libraryMode`.
- **Developer** — link to the `spike` engine-checks screen.

## Files
- `src/app/settings.tsx` — the modal screen (sections + radio rows).
- Reads/writes `useSettingsStore` for `themeId` and `libraryMode`.
- Theme selection flows through `useTheme().setThemeId`, which updates
  `settingsStore`, which the root `ThemeProvider` consumes.

## Contracts
- Settings are currently in-memory; persistence to the `settings` table arrives
  with the repository layer (Phase 2).
- Library mode is declarative only for now; scanning honors it in Phase 2.

## Verified on device
- Switching to **Daylight** flipped the entire UI to the light theme.
- Selecting **Selected folders only** moved the selection checkmark.
