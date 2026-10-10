# YGMusic Player

An offline, ad-free music player for **Android first** (iOS planned; desktop via
Expo Web + Tauri later). It plays the music you already own, gives you explicit
control over what the app can see, and is built to be themed and extended.

- **No ads, no network required.** Everything is local; SQLite is the only store.
- **You choose the scope.** Grant a single folder *or* the whole device library.
- **Themeable & modular.** Runtime data-driven themes and a module registry so
  new looks and features can be added without rewiring the app.
- **Real audio DSP.** 15-band equalizer with presets plus bass/immersive effects.

> Status: **Phase 1 complete** — app shell with tabbed navigation, theming,
> settings, module registry, state stores, and core audio/DB engines, all tested
> and verified on Android. See [`TODO.md`](./TODO.md).

## Tech stack

| Concern    | Choice |
| ---------- | ------ |
| Shell      | Expo SDK 57 (dev builds / CNG) |
| UI         | React Native 0.86 · NativeWind v4 (Tailwind) |
| Audio      | `react-native-audio-api` (Web-Audio graph, Oboe/AVFoundation) |
| Database   | `expo-sqlite` + Drizzle ORM |
| Navigation | Expo Router (`src/app`) |
| State      | Zustand (planned) + Drizzle live queries |
| Tests      | Jest (`jest-expo`) + Testing Library |

## Prerequisites

- Node.js LTS (repo currently builds on Node 26, but LTS is recommended)
- **JDK 17** for Android Gradle builds (system Java 26+ is too new)
- Android SDK with platform/build-tools (auto-downloaded by Gradle if missing)

This machine has a local Temurin JDK 17 and the Android SDK pre-configured.
Always source the env script before native commands:

```bash
source scripts/android-env.sh
```

## Getting started

```bash
npm install

# Android (development build — required; the audio engine is not in Expo Go)
source scripts/android-env.sh
npm run android

# Type-check, lint, test
npm run typecheck
npm run lint
npm test
```

## Useful commands

| Command | Purpose |
| ------- | ------- |
| `npm run android` | Build & run the Android dev build (`expo run:android`) |
| `npm run ios` | Build & run iOS (requires macOS) |
| `npm run web` | Run the Expo web target |
| `npm run lint` | ESLint (`expo lint`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Jest test suites |
| `npm run test:coverage` | Jest with coverage + thresholds |
| `npm run db:generate` | Generate SQL migrations from the Drizzle schema |
| `npm run format` | Prettier |

## Project layout

```
src/
  app/                 # Expo Router routes (thin)
  core/                # framework-agnostic engines
    audio/             # equalizer, player engine, queue
    db/                # Drizzle schema + client
    theme/             # design tokens + provider
  features/            # feature modules (added per phase)
  shared/              # design system + utilities
drizzle/               # generated SQL migrations (committed)
scripts/android-env.sh # local JDK/SDK environment
feature-documentation/ # one markdown file per important feature
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`TESTS.md`](./TESTS.md),
[`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md), and [`TODO.md`](./TODO.md).

## License

See [`LICENSE`](./LICENSE).
