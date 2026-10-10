# TODO

Status legend: `[x]` done · `[~]` in progress · `[ ]` pending

## Phase 0 — Toolchain, scaffold & de-risking spike `[x]`

- [x] Local JDK 17 + reproducible `scripts/android-env.sh`
- [x] Expo SDK 57 + TypeScript scaffold
- [x] NativeWind v4 + Tailwind, theme tokens + `ThemeProvider`
- [x] Expo Router app shell (`src/app`)
- [x] `expo-sqlite` + Drizzle schema, client, generated migration
- [x] `react-native-audio-api`: 15-band EQ graph, presets, queue, player engine spike
- [x] Jest + Testing Library + ESLint + Prettier + coverage gate
- [x] Native Android debug build succeeded; app verified on emulator
- [x] Documentation set (README, ARCHITECTURE, PROJECT_CONTEXT, TESTS, feature-documentation)

## Phase 1 — Core skeleton `[x]`

- [x] Module registry + capability interfaces (`core/plugins`)
- [x] Zustand stores for player/UI state
- [x] Wire Drizzle `useMigrations` at app startup (`DatabaseProvider`)
- [x] Design-system primitives in `shared/ui` (Screen, Button, Slider, AlbumArt, ScreenHeader, EmptyState)
- [x] Navigation shell: bottom tabs (Songs, Artists, Albums, Folders, Playlists) + stack
- [x] Settings screen: library mode, theme selection
- [ ] Album cover `Carousel` primitive (deferred to Phase 3 with the Albums page)

## Phase 2 — Library ingestion `[x]`

- [x] Android SAF folder picker (`Directory.pickDirectoryAsync`) + persist grant row
- [x] Optional whole-device scan (MediaStore via `expo-media-library`)
- [x] Metadata parsing behind `MetadataProvider` (filename provider)
- [x] Incremental scan pipeline using `scan_cache`
- [x] Folders page (list/add/scan/remove; device scan)
- [ ] Cross-restart SAF permission persistence (`takePersistableUriPermission`)
- [ ] Subfolder drill-down UI (`buildFolderTree` is ready)

## Phase 3 — Browsing `[ ]`

- [ ] Songs page (all tracks, search/sort, favorites)
- [ ] Artists page + artist detail
- [ ] Albums page with horizontal cover carousel + disc-border effect
- [ ] Folders page polish

## Phase 4 — Playback & playlists `[ ]`

- [ ] Now Playing screen with full transport + queue view
- [ ] Repeat (off/all/one) & shuffle wired to `PlayerQueue`
- [ ] Persistent queue (survives restart)
- [ ] Playlist CRUD, reorder, custom cover image

## Phase 5 — Audio DSP `[ ]`

- [ ] Interactive 15-band EQ UI + presets + preamp
- [ ] Bass enhancement + immersive/stereo widening modules
- [ ] Analyzer-driven visualizer
- [ ] Audio-focus/interruption + notification controls hardening
- [ ] Streaming playback path (avoid whole-file decode)

## Phase 6 — Extensibility surface `[ ]`

- [ ] Theme manager UI (import/export JSON themes)
- [ ] Module enable/disable UI
- [ ] Documented plugin/theme authoring guide

## Phase 7 — Hardening & release `[ ]`

- [ ] Large-library performance (virtualized lists, indexing)
- [ ] E2E smoke tests (Maestro)
- [ ] Signed release build + EAS profile

## Follow-ups / known issues

- [ ] Confirm long-file streaming + seek behavior on device and pick the final
      player path (spike currently decodes whole files).
- [ ] Consider a Node LTS version manager for reproducibility.
- [ ] Add `expo-system-ui` already installed; verify android `userInterfaceStyle`.
