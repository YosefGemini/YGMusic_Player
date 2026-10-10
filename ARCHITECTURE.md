# Architecture

YGMusic Player uses **Screaming Architecture**: the folder structure and module
boundaries announce what the product does, not what framework it uses. Features
depend on stable `core` contracts, which keeps the app easy to extend and theme.

## Layers

```
src/
  app/            Routes. Expo Router files only; no business logic.
  core/           Framework-agnostic engines and contracts.
    audio/        Equalizer graph, player engine, queue logic.
    db/           Drizzle schema, migrations, connection.
    theme/        Design tokens + ThemeProvider.
    plugins/      Module registry + capability interfaces.   (Phase 1)
    files/        SAF / MediaStore access.                   (Phase 2)
    metadata/     Tag parsing behind a provider interface.   (Phase 2)
  features/       Vertical slices: player, library-*, playlists, settings, themes.
  shared/         Reusable UI (design system), hooks, utils.
  store/          Zustand stores (player/UI).                (Phase 1)
```

Rules:

1. `core` never imports from `features`. Features depend on core contracts.
2. A feature exposes a public surface via its `index.ts`; cross-feature imports
   go through that surface only.
3. Routes in `src/app` stay thin — they render feature screens.
4. Native/platform behavior is configured in `app.json` (CNG). Never hand-edit
   generated `android/` or `ios/`.

## Audio architecture

```
file/stream ──▶ AudioBufferSourceNode ──▶ [15× BiquadFilter (EQ)] ──▶ preamp ──▶ destination
                        ▲
                        └── source.connect(equalizer.input)
```

- **`core/audio/equalizer`**
  - `bands.ts` — canonical 15 frequencies, gain/preamp limits, sanitizers.
  - `presets.ts` — built-in EQ presets as pure data.
  - `equalizerGraph.ts` — builds and controls the native filter chain; exposes
    `setBandGain`, `setBands`, `setPreamp`, `setBypassed`.
- **`core/audio/player`**
  - `queue.ts` — pure, framework-free playback queue (repeat off/all/one,
    shuffle), fully unit-tested.
  - `playerEngine.ts` — owns the `AudioContext`, wires the EQ into the graph,
    drives background playback and the media notification via `AudioManager`
    and `PlaybackNotificationManager`.
- **Enhancements** (bass/immersive) will be additional `core/audio` modules on
  the same graph in Phase 5.

Insertion point for any future effect is always `source → effects → destination`.

## Data architecture

- `core/db/schema.ts` defines all tables with Drizzle (SQLite).
- `core/db/client.ts` opens a single `expo-sqlite` connection with change
  listeners enabled, powering Drizzle live queries.
- Migrations are generated with `npm run db:generate` into `drizzle/` and
  bundled into the app (via `babel-plugin-inline-import`).

Tables: `tracks`, `artists`, `albums`, `folders`, `playlists`,
`playlist_items`, `queue_items`, `eq_presets`, `settings`, `scan_cache`.

`scan_cache` enables incremental library scans: files whose mtime/size are
unchanged are skipped.

## Theme architecture

- `core/theme/tokens.ts` defines `ThemeTokens` (colors as `r g b` triplets,
  radius, color scheme) and built-in themes: Midnight, OLED Black, Daylight.
- `core/theme/ThemeProvider.tsx` resolves the active theme and injects CSS
  custom properties via NativeWind's `vars()`, so Tailwind classes like
  `bg-background` / `text-primary` update instantly.
- `tailwind.config.js` maps semantic color names to those CSS variables.
- Future **user themes** are plain JSON/`ThemeTokens` objects passed to
  `ThemeProvider` — no rebuild required.

## Extensibility: module registry (Phase 1)

The registry maps capability keys to implementations:

| Capability        | Interface owner            |
| ----------------- | -------------------------- |
| `AudioEffect`     | `core/plugins`             |
| `Visualizer`      | `core/plugins`             |
| `MetadataProvider`| `core/plugins`             |
| `LibraryScanner`  | `core/plugins`             |
| `ThemeSource`     | `core/plugins`             |
| `RouteContribution`| `core/plugins`            |

Built-in modules self-register at startup; features consume interfaces, not
implementations. **Dynamic native code loading is impossible on iOS**, so
"plugins" are bundled modules toggled on/off — themes remain fully dynamic data.

## Testing

Each engine is tested in isolation. See [`TESTS.md`](./TESTS.md) for the matrix.
Native audio is faked at the module boundary for unit tests and validated on a
device for behavior.
