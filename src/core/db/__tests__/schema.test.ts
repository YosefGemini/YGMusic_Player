import { getTableName } from "drizzle-orm";

import {
  albums,
  artists,
  eqPresets,
  folders,
  playlistItems,
  playlists,
  queueItems,
  randomId,
  scanCache,
  settings,
  tracks,
} from "../schema";

describe("database schema", () => {
  it("generates unique, url-safe identifiers", () => {
    const a = randomId();
    const b = randomId();
    expect(a).toHaveLength(24);
    expect(a).toMatch(/^[0-9a-z]+$/);
    expect(a).not.toBe(b);
  });

  it("exposes every expected table with a stable name", () => {
    const names = [
      artists,
      albums,
      folders,
      tracks,
      playlists,
      playlistItems,
      queueItems,
      eqPresets,
      settings,
      scanCache,
    ].map(getTableName);

    expect(names).toEqual([
      "artists",
      "albums",
      "folders",
      "tracks",
      "playlists",
      "playlist_items",
      "queue_items",
      "eq_presets",
      "settings",
      "scan_cache",
    ]);
  });

  it("models the core track fields needed by the library", () => {
    const columns = tracks as unknown as Record<string, unknown>;
    for (const field of [
      "id",
      "title",
      "artistId",
      "albumId",
      "folderId",
      "uri",
      "durationMs",
      "isFavorite",
    ]) {
      expect(columns[field]).toBeDefined();
    }
  });
});
