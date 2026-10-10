import { count, desc, eq } from "drizzle-orm";

import type { Database } from "@/core/db/client";
import { tracks, type Track } from "@/core/db/schema";

export function createTracksRepository(db: Database) {
  return {
    async count(): Promise<number> {
      const rows = await db.select({ value: count() }).from(tracks);
      return rows[0]?.value ?? 0;
    },

    async countByFolder(folderId: string): Promise<number> {
      const rows = await db
        .select({ value: count() })
        .from(tracks)
        .where(eq(tracks.folderId, folderId));
      return rows[0]?.value ?? 0;
    },

    async listRecentlyAdded(limit = 50): Promise<Track[]> {
      return db.select().from(tracks).orderBy(desc(tracks.dateAdded)).limit(limit);
    },
  };
}

export type TracksRepository = ReturnType<typeof createTracksRepository>;
