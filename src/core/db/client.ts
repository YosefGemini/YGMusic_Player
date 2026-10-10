import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import * as schema from "./schema";

export const DATABASE_NAME = "ygmusic.db";

/**
 * Single shared connection. `enableChangeListener` powers Drizzle's live
 * queries so list screens re-render automatically after scans/edits.
 */
export const expoDb = openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
});

export const db = drizzle(expoDb, { schema });

export { schema };
export type Database = typeof db;
