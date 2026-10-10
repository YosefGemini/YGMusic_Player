import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/**
 * Generates a stable, URL-safe identifier. Kept dependency-free so the schema
 * can be imported in Node (tests, drizzle-kit) without React Native globals.
 */
export function randomId(): string {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < 24; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomId());

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());

/* -------------------------------------------------------------------------- */
/* Library                                                                    */
/* -------------------------------------------------------------------------- */

export const artists = sqliteTable(
  "artists",
  {
    id: id(),
    name: text("name").notNull(),
    sortName: text("sort_name").notNull().default(""),
    artworkUri: text("artwork_uri"),
    createdAt: createdAt(),
  },
  (t) => ({
    nameIdx: uniqueIndex("artists_name_idx").on(t.name),
    sortIdx: index("artists_sort_idx").on(t.sortName),
  }),
);

export const albums = sqliteTable(
  "albums",
  {
    id: id(),
    title: text("title").notNull(),
    artistId: text("artist_id").references(() => artists.id, {
      onDelete: "set null",
    }),
    year: integer("year"),
    artworkUri: text("artwork_uri"),
    trackCount: integer("track_count").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => ({
    titleIdx: index("albums_title_idx").on(t.title),
    artistIdx: index("albums_artist_idx").on(t.artistId),
  }),
);

/**
 * A folder the user has explicitly granted access to. `uri` is the platform
 * handle (SAF tree uri on Android, `file://` path elsewhere); `accessMode`
 * records whether the user chose a single folder or the whole-device library.
 */
export const folders = sqliteTable(
  "folders",
  {
    id: id(),
    uri: text("uri").notNull(),
    name: text("name").notNull(),
    parentId: text("parent_id"),
    accessMode: text("access_mode", { enum: ["saf", "mediastore", "path"] })
      .notNull()
      .default("saf"),
    scanEnabled: integer("scan_enabled", { mode: "boolean" })
      .notNull()
      .default(true),
    createdAt: createdAt(),
  },
  (t) => ({
    uriIdx: uniqueIndex("folders_uri_idx").on(t.uri),
    parentIdx: index("folders_parent_idx").on(t.parentId),
  }),
);

export const tracks = sqliteTable(
  "tracks",
  {
    id: id(),
    title: text("title").notNull(),
    artistId: text("artist_id").references(() => artists.id, {
      onDelete: "set null",
    }),
    albumId: text("album_id").references(() => albums.id, {
      onDelete: "set null",
    }),
    folderId: text("folder_id").references(() => folders.id, {
      onDelete: "cascade",
    }),
    uri: text("uri").notNull(),
    fileName: text("file_name").notNull().default(""),
    durationMs: integer("duration_ms").notNull().default(0),
    trackNo: integer("track_no"),
    discNo: integer("disc_no"),
    year: integer("year"),
    genre: text("genre"),
    bitrate: integer("bitrate"),
    sampleRate: integer("sample_rate"),
    sizeBytes: integer("size_bytes").notNull().default(0),
    mimeType: text("mime_type"),
    artworkUri: text("artwork_uri"),
    dateAdded: createdAt(),
    lastPlayed: integer("last_played", { mode: "timestamp" }),
    playCount: integer("play_count").notNull().default(0),
    isFavorite: integer("is_favorite", { mode: "boolean" })
      .notNull()
      .default(false),
  },
  (t) => ({
    uriIdx: uniqueIndex("tracks_uri_idx").on(t.uri),
    artistIdx: index("tracks_artist_idx").on(t.artistId),
    albumIdx: index("tracks_album_idx").on(t.albumId),
    folderIdx: index("tracks_folder_idx").on(t.folderId),
  }),
);

/* -------------------------------------------------------------------------- */
/* Playlists & queue                                                         */
/* -------------------------------------------------------------------------- */

export const playlists = sqliteTable("playlists", {
  id: id(),
  name: text("name").notNull(),
  description: text("description"),
  coverUri: text("cover_uri"),
  isSystem: integer("is_system", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const playlistItems = sqliteTable(
  "playlist_items",
  {
    id: id(),
    playlistId: text("playlist_id")
      .notNull()
      .references(() => playlists.id, { onDelete: "cascade" }),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    addedAt: createdAt(),
  },
  (t) => ({
    playlistIdx: index("playlist_items_playlist_idx").on(t.playlistId),
    uniq: uniqueIndex("playlist_items_uniq_idx").on(t.playlistId, t.trackId),
  }),
);

export const queueItems = sqliteTable(
  "queue_items",
  {
    id: id(),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    source: text("source", {
      enum: ["track", "album", "artist", "playlist", "folder", "all"],
    })
      .notNull()
      .default("all"),
    sourceId: text("source_id"),
  },
  (t) => ({
    positionIdx: index("queue_items_position_idx").on(t.position),
  }),
);

/* -------------------------------------------------------------------------- */
/* Equalizer, settings, scan cache                                           */
/* -------------------------------------------------------------------------- */

export const eqPresets = sqliteTable("eq_presets", {
  id: id(),
  name: text("name").notNull(),
  isBuiltIn: integer("is_built_in", { mode: "boolean" }).notNull().default(false),
  preampDb: real("preamp_db").notNull().default(0),
  /** JSON array of 15 gain values in dB, low → high frequency. */
  bands: text("bands").notNull(),
  createdAt: createdAt(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/**
 * Incremental-scan bookkeeping: lets us skip re-parsing files whose
 * modification time and size are unchanged since the last scan.
 */
export const scanCache = sqliteTable(
  "scan_cache",
  {
    uri: text("uri").primaryKey(),
    folderId: text("folder_id").references(() => folders.id, {
      onDelete: "cascade",
    }),
    mtime: integer("mtime").notNull().default(0),
    size: integer("size").notNull().default(0),
    hash: text("hash"),
    parsedAt: integer("parsed_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    folderIdx: index("scan_cache_folder_idx").on(t.folderId),
  }),
);

export type Track = typeof tracks.$inferSelect;
export type NewTrack = typeof tracks.$inferInsert;
export type Artist = typeof artists.$inferSelect;
export type Album = typeof albums.$inferSelect;
export type Folder = typeof folders.$inferSelect;
export type Playlist = typeof playlists.$inferSelect;
export type EqPreset = typeof eqPresets.$inferSelect;
