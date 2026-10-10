import { eq } from "drizzle-orm";

import type { Database } from "@/core/db/client";
import { folders } from "@/core/db/schema";
import type { AccessMode, ScannableFolder } from "@/core/files";

export type FolderRecord = typeof folders.$inferSelect;

export interface NewFolder {
  uri: string;
  name: string;
  parentUri?: string | null;
  accessMode: AccessMode;
}

/** Converts a `folders` row into the shape the scanner consumes. */
export function toScannableFolder(row: FolderRecord): ScannableFolder {
  return {
    id: row.id,
    uri: row.uri,
    name: row.name,
    parentUri: row.parentUri,
    accessMode: row.accessMode,
  };
}

export function createFoldersRepository(db: Database) {
  return {
    async list(): Promise<FolderRecord[]> {
      return db.select().from(folders).orderBy(folders.createdAt);
    },

    async getById(id: string): Promise<FolderRecord | null> {
      const rows = await db.select().from(folders).where(eq(folders.id, id)).limit(1);
      return rows[0] ?? null;
    },

    async getByUri(uri: string): Promise<FolderRecord | null> {
      const rows = await db.select().from(folders).where(eq(folders.uri, uri)).limit(1);
      return rows[0] ?? null;
    },

    /** Inserts a folder, or returns the existing row when the uri already exists. */
    async add(input: NewFolder): Promise<FolderRecord> {
      const inserted = await db
        .insert(folders)
        .values({
          uri: input.uri,
          name: input.name,
          parentUri: input.parentUri ?? null,
          accessMode: input.accessMode,
        })
        .onConflictDoNothing({ target: folders.uri })
        .returning();
      if (inserted[0]) return inserted[0];

      const existing = await this.getByUri(input.uri);
      if (!existing) throw new Error(`Failed to insert folder ${input.uri}`);
      return existing;
    },

    async remove(id: string): Promise<void> {
      await db.delete(folders).where(eq(folders.id, id));
    },

    async setScanEnabled(id: string, enabled: boolean): Promise<void> {
      await db.update(folders).set({ scanEnabled: enabled }).where(eq(folders.id, id));
    },
  };
}

export type FoldersRepository = ReturnType<typeof createFoldersRepository>;
