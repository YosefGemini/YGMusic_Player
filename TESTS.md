# Tests

## Strategy

| Level | Tool | Scope |
| ----- | ---- | ----- |
| Unit | Jest (`jest-expo`) | Pure logic: EQ math/presets, queue, theme tokens, schema |
| Component | Testing Library | Screens/controls (introduced as features land) |
| Integration | Jest + in-memory SQLite | Drizzle repositories (added in phase 2) |
| Device/E2E | Manual / Maestro | Real audio, background, notifications, gestures |

Native modules are faked at the module boundary for unit tests (see
`jest.setup.ts`). Tests assert on **our** configuration and derivations, never
on real audio output; audible behavior is validated on a device.

A feature is not "done" until its tests pass **and** its
`feature-documentation/*.md` file lists the covering tests.

## Commands

```bash
npm test               # run all suites
npm run test:watch     # watch mode
npm run test:coverage  # coverage + thresholds (statements 70, branches 60, fns 70, lines 70)
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
```

## Coverage gate

Configured in `jest.config.js` (statements 70, branches 60, fns 70, lines 70).
Platform glue with no Jest analogue — native listers, SQL repositories, feature
screens, routes, and type-only/barrel files — is excluded from the denominator
and validated on device instead. Current result (Phase 2):

```
All files    | 89.11% stmts | 83.33% branch | 80.85% funcs | 90.18% lines
```

## Test matrix

| Area | Test file | What it covers |
| ---- | --------- | -------------- |
| EQ bands | `src/core/audio/equalizer/__tests__/bands.test.ts` | 15 frequencies, clamping, validation, sanitizing |
| EQ presets | `src/core/audio/equalizer/__tests__/presets.test.ts` | 15-band shape, in-range gains, lookup, normalization |
| EQ graph | `src/core/audio/equalizer/__tests__/equalizerGraph.test.ts` | filter chain wiring, gain/preamp application, bypass, dispose |
| Player queue | `src/core/audio/player/__tests__/queue.test.ts` | repeat off/all/one, shuffle, next/prev, jump, empty library |
| Player engine | `src/core/audio/player/__tests__/playerEngine.test.ts` | graph→destination wiring, load/decode, play/pause/stop, errors |
| Theme tokens | `src/core/theme/__tests__/tokens.test.ts` | built-in set, resolve/fallback, CSS vars, color conversion |
| Theme provider | `src/core/theme/__tests__/ThemeProvider.test.tsx` | provides theme, notifies owner, throws outside provider |
| DB schema | `src/core/db/__tests__/schema.test.ts` | id generation, table names, core track fields |
| DB migration state | `src/core/db/__tests__/migrationState.test.ts` | loading/ready/error decision |
| DB provider | `src/core/db/__tests__/DatabaseProvider.test.tsx` | loading/ready/error render gate |
| Module registry | `src/core/plugins/__tests__/registry.test.ts` | register/dupes, capability filter, enable/disable, bootstrap lifecycle |
| Player store | `src/store/__tests__/playerStore.test.ts` | queue/derived state, transport, repeat/shuffle, jump, clear |
| Settings store | `src/store/__tests__/settingsStore.test.ts` | defaults, updates, reset |
| Slider math | `src/shared/ui/__tests__/sliderMath.test.ts` | ratio/value mapping + clamping |
| UI components | `src/shared/ui/__tests__/*.test.tsx` | Button, Screen, EmptyState, ScreenHeader, AlbumArt, Slider |
| Audio extensions | `src/core/files/__tests__/audioExtensions.test.ts` | extension parsing + audio detection |
| Folder tree | `src/core/files/__tests__/folderTree.test.ts` | nesting, orphan parents, empty |
| Filename parsing | `src/core/metadata/__tests__/parseFilename.test.ts` | artist/title/track patterns |
| Metadata provider | `src/core/metadata/__tests__/filenameProvider.test.ts` | provider mapping |
| Library scanner | `src/core/library/__tests__/scanner.test.ts` | create/skip/update/remove/errors/aggregate |
| Library modules | `src/core/library/__tests__/modules.test.ts` | services + registry capabilities |

Totals at Phase 2: **26 suites · 105 tests · all passing**.

## Device validation checklist

### Phase 0 (Pixel_3a_API_34)
- [x] `./gradlew :app:assembleDebug` → BUILD SUCCESSFUL
- [x] App launches; no JS/native crashes
- [x] Theme switching + queue advance work
- [x] Native audio initializes (`OboeAudio … openStreamInternal()`, `requestAudioFocus()`)

### Phase 1 (Pixel_3a_API_34)
- [x] Rebuild with `expo-font` linked → BUILD SUCCESSFUL
- [x] Bottom tabs render and navigate (Songs/Artists/Albums/Folders/Playlists)
- [x] Settings modal opens; theme switch Midnight → Daylight flips the whole UI
- [x] Library-mode selection updates (`Whole device` ↔ `Selected folders only`)
- [x] Ionicons follow the theme after the `cssInterop` fix
- [x] `DatabaseProvider` gates the app on migrations (no error screen)

### Phase 2 (Pixel_3a_API_34)
- [x] Rebuild with `expo-file-system` + `expo-media-library` → BUILD SUCCESSFUL
- [x] App boots with the regenerated migration; no crash
- [x] Folders screen renders (device-mode card + empty state)
- [x] **Add folder** opens the system directory picker (`com.google.android.documentsui`)
- [x] **Scan device library** inserts a folder live and completes a scan
      (MediaStore → scanner → SQLite → live UI)
