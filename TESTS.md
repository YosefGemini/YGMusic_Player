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

Configured in `jest.config.js`. Current result (Phase 0):

```
All files    | 80.37% stmts | 75.39% branch | 70.64% funcs | 81.40% lines
```

## Test matrix

| Area | Test file | What it covers |
| ---- | --------- | -------------- |
| EQ bands | `src/core/audio/equalizer/__tests__/bands.test.ts` | 15 frequencies, clamping, validation, sanitizing |
| EQ presets | `src/core/audio/equalizer/__tests__/presets.test.ts` | 15-band shape, in-range gains, lookup, normalization |
| EQ graph | `src/core/audio/equalizer/__tests__/equalizerGraph.test.ts` | filter chain wiring, gain/preamp application, bypass, dispose |
| Player queue | `src/core/audio/player/__tests__/queue.test.ts` | repeat off/all/one, shuffle, next/prev, jump, empty library |
| Player engine | `src/core/audio/player/__tests__/playerEngine.test.ts` | graph→destination wiring, load/decode, play/pause/stop, errors |
| Theme tokens | `src/core/theme/__tests__/tokens.test.ts` | built-in set, resolve/fallback, CSS vars, hex conversion |
| DB schema | `src/core/db/__tests__/schema.test.ts` | id generation, table names, core track fields |

Totals at Phase 0: **7 suites · 37 tests · all passing**.

## Device validation checklist (Phase 0)

Performed on `Pixel_3a_API_34` emulator:

- [x] `./gradlew :app:assembleDebug` → BUILD SUCCESSFUL (94 MB APK)
- [x] Metro bundle served without errors (1755 modules)
- [x] App launches; `MainActivity` resumed; no JS/native crashes in logcat
- [x] Theme switching (Midnight → OLED Black) updates colors live
- [x] Queue "Next" advances the current track
- [x] Native audio engine initializes: logcat shows `OboeAudio … openStreamInternal()`
      and `requestAudioFocus()` from `com.swmansion.audioapi`
