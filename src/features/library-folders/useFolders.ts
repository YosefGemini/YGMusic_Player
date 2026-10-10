import { count } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/core/db/client";
import { folders, tracks } from "@/core/db/schema";
import type { FolderRecord } from "@/core/db/repositories";

/** Live list of granted folders, ordered by when they were added. */
export function useFolders(): FolderRecord[] {
  const { data } = useLiveQuery(db.select().from(folders).orderBy(folders.createdAt));
  return (data as FolderRecord[] | undefined) ?? [];
}

/** Live per-folder track counts, keyed by folder id. */
export function useFolderTrackCounts(): Record<string, number> {
  const { data } = useLiveQuery(
    db
      .select({ folderId: tracks.folderId, value: count() })
      .from(tracks)
      .groupBy(tracks.folderId),
  );
  const rows = (data as { folderId: string | null; value: number }[] | undefined) ?? [];
  const result: Record<string, number> = {};
  for (const row of rows) {
    if (row.folderId) result[row.folderId] = row.value;
  }
  return result;
}
