# Project Context

## Problem

Existing Android music players either show ads, phone home, or lock the user
into styles and feature sets they cannot change. YGMusic Player is an offline,
ad-free player whose owner decides both what music it can access and how it
looks and behaves.

## Goals

1. Play the user's local music with **no ads and no internet requirement**.
2. Let the user explicitly choose **scope**: a single folder or the whole
   device library.
3. Provide a full player: now-playing screen, transport, queue, repeat/shuffle,
   and a 15-band equalizer with presets plus bass/immersive enhancements.
4. Browse by **Songs, Artists, Albums (carousel), Folders, and Playlists**
   (with custom cover images).
5. Be **themeable and modular**: installable styles/themes and a module
   registry so the base can grow without rewrites.
6. Ship cross-platform from one codebase (Android first; iOS, then desktop).

## Constraints & decisions (ADR log)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **React Native + Expo** as the base | Single codebase, native performance, large ecosystem, Tailwind via NativeWind |
| 2 | **`react-native-audio-api`** as the audio engine | One engine provides the Web-Audio playback graph, 15-band EQ (`BiquadFilterNode`), effects, analysis, background playback, and media notification/lock-screen controls. MIT-licensed. |
| 3 | **Avoid `react-native-track-player` v5** | v5 is dual-licensed and paid for commercial use; v4 is frozen. Not needed given decision 2. |
| 4 | **`expo-sqlite` + Drizzle ORM** | Typed schema, bundled migrations, live queries; portable to web later |
| 5 | **Expo Router** for navigation | Matches repository `AGENTS.md`; routes in `src/app` |
| 6 | **NativeWind v4 (Tailwind v3)** | Stable, Expo-supported; theming via CSS variables |
| 7 | **Themes as runtime data + module registry** | iOS forbids dynamic native code; data themes are safe and dynamic, features are bundled modules |
| 8 | **Android first** | Primary target; iOS/desktop deferred but architecture stays portable |
| 9 | **Desktop later via Expo Web + Tauri** | React Native has no official Linux desktop target |
| 10 | **Local JDK 17 + `scripts/android-env.sh`** | System JDK 26/27 exceeds the RN Gradle toolchain range; `ANDROID_HOME` unset |

## Environment notes

- Node 26.10.0, npm 12.1.0 (LTS recommended).
- Temurin **JDK 17** installed at `~/.local/opt/jdk-17.0.20.1+1`.
- Android SDK at `~/Android/Sdk` (platform 34 present; Gradle auto-downloads 36).
- Two AVDs available; `Pixel_3a_API_34_extension_level_7_x86_64` used for validation.

## Phase status

- **Phase 0 — complete**: toolchain, scaffold, core engines, tests, docs,
  verified Android build and runtime.
- **Phase 1 — complete**: module registry, Zustand stores, `DatabaseProvider`
  migrations, design system, navigation shell, settings screen; verified on device.
- **Phase 2 — complete**: SAF folder picker, MediaStore scan, filename metadata
  provider, incremental scan pipeline, SQLite repositories, Folders screen;
  verified on device.
- Next: **Phase 3 — browsing** (Songs, Artists, Albums carousel, Folders drill-down).
