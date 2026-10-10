import { eq } from "drizzle-orm";

import type { Database } from "@/core/db/client";
import { albums, artists, randomId, scanCache, tracks } from "@/core/db/schema";
import type { ScanRepository, TrackUpsert } from "@/core/library";

async function ensureArtist(
  db: Database,
  name: string | undefined,
): Promise<string | null> {
  if (!name) return null;
  const existing = await db
    .select({ id: artists.id })
    .from(artists)
    .where(eq(artists.name, name))
    .limit(1);
  if (existing[0]) return existing[0].id;

  const id = randomId();
  await db
    .insert(artists)
    .values({ id, name, sortName: name.toLowerCase() })
    .onConflictDoNothing({ target: artists.name });
  return id;
}

async function ensureAlbum(
  db: Database,
  title: string | undefined,
  artistId: string | null,
  year: number | undefined,
): Promise<string | null> {
  if (!title) return null;
  const existing = await db
    .select({ id: albums.id })
    .from(albums)
    .where(eq(albums.title, title))
    .limit(1);
  if (existing[0]) return existing[0].id;

  const id = randomId();
  await db.insert(albums).values({
    id,
    title,
    artistId,
    year: year ?? null,
  });
  return id;
}

/** SQLite-backed implementation of the scanner's persistence port. */
export function createScanRepository(db: Database): ScanRepository {
  return {
    async getScanCacheEntry(uri) {
      const rows = await db
        .select()
        .from(scanCache)
        .where(eq(scanCache.uri, uri))
        .limit(1);
      const row = rows[0];
      return row ? { mtimeMs: row.mtime, sizeBytes: row.size } : null;
    },

    async upsertScanCache(entry) {
      await db
        .insert(scanCache)
        .values({
          uri: entry.uri,
          folderId: entry.folderId,
          mtime: entry.mtimeMs,
          size: entry.sizeBytes,
        })
        .onConflictDoUpdate({
          target: scanCache.uri,
          set: {
            folderId: entry.folderId,
            mtime: entry.mtimeMs,
            size: entry.sizeBytes,
          },
        });
    },

    async deleteScanCache(uri) {
      await db.delete(scanCache).where(eq(scanCache.uri, uri));
    },

    async upsertTrack(input: TrackUpsert) {
      const { file, metadata, folderId } = input;
      const artistId = await ensureArtist(db, metadata.artist);
      const albumId = await ensureAlbum(db, metadata.album, artistId, metadata.year);

      const existing = await db
        .select({ id: tracks.id })
        .from(tracks)
        .where(eq(tracks.uri, file.uri))
        .limit(1);

      const values = {
        title: metadata.title,
        artistId,
        albumId,
        folderId,
        uri: file.uri,
        fileName: file.fileName,
        durationMs: metadata.durationMs ?? 0,
        trackNo: metadata.trackNo ?? null,
        discNo: metadata.discNo ?? null,
        year: metadata.year ?? null,
        genre: metadata.genre ?? null,
        sizeBytes: file.sizeBytes,
        artworkUri: metadata.artworkUri ?? null,
      };

      if (existing[0]) {
        await db.update(tracks).set(values).where(eq(tracks.id, existing[0].id));
        return "updated";
      }
      await db.insert(tracks).values(values);
      return "created";
    },

    async listTrackUrisInFolder(folderId) {
      const rows = await db
        .select({ uri: tracks.uri })
        .from(tracks)
        .where(eq(tracks.folderId, folderId));
      return rows.map((row) => row.uri);
    },

    async deleteTrackByUri(uri) {
      await db.delete(tracks).where(eq(tracks.uri, uri));
    },
  };
}
