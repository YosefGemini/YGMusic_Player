# Feature: Database

**Status:** Phase 0 (schema + migration) · repositories in Phase 2

## Purpose
Store the entire library, playlists, queue, EQ presets, settings, and scan
bookkeeping locally in SQLite — no server, no network.

## Behavior
- Single `expo-sqlite` connection with change listeners enabled, powering
  Drizzle live queries so lists refresh after scans/edits.
- Typed schema in Drizzle; SQL migrations are generated and bundled into the app.

## Files
- `src/core/db/schema.ts` — all tables + inferred types.
- `src/core/db/client.ts` — connection + `drizzle(...)` instance.
- `drizzle.config.ts`, `drizzle/` — generated SQL migrations.
- `babel.config.js` / `metro.config.js` — bundle `.sql` via `inline-import`.

## Tables
`tracks`, `artists`, `albums`, `folders`, `playlists`, `playlist_items`,
`queue_items`, `eq_presets`, `settings`, `scan_cache`.

## Contracts
- `randomId()` → 24-char url-safe id (used as default PK).
- Foreign keys: tracks → artists/albums/folders; playlist_items → playlists/tracks;
  queue_items → tracks; scan_cache → folders.
- `scan_cache` (uri, mtime, size, hash) enables incremental scans.
- `DatabaseProvider` runs `useMigrations(db, migrations)` before rendering the
  app and gates on `migrationState({ success, error })` (loading/ready/error).

## Edge cases
- Unique indexes prevent duplicate tracks (by uri), artists (by name), and
  duplicate playlist entries.
- Deleting a folder cascades to its tracks and scan records.

## Tests
- `src/core/db/__tests__/schema.test.ts` — id generation, stable table names,
  presence of core track fields.
- `src/core/db/__tests__/migrationState.test.ts` — loading/ready/error logic.
- `src/core/db/__tests__/DatabaseProvider.test.tsx` — loading/ready/error UI.
- Migration generation verified with `npm run db:generate` (10 tables); the
  provider runs them at startup (verified on device).

## Pending
Repositories and in-memory integration tests (Phase 2).
