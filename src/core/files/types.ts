/**
 * How the app obtained access to a folder.
 * - `saf`: Storage Access Framework (Android) / document picker (iOS).
 * - `mediastore`: the whole-device audio library.
 * - `path`: a raw filesystem path (desktop/legacy).
 */
export type AccessMode = "saf" | "mediastore" | "path";

/** A directory the user granted the app access to. */
export interface FolderRef {
  uri: string;
  name: string;
  parentUri: string | null;
  accessMode: AccessMode;
}

/** A folder that also has a database id (used during scanning). */
export interface ScannableFolder extends FolderRef {
  id: string;
}

/** A single audio file discovered by a `FileLister`. */
export interface ScannedFile {
  uri: string;
  fileName: string;
  extension: string;
  sizeBytes: number;
  /** Last modification time in epoch milliseconds (0 when unknown). */
  mtimeMs: number;
  parentFolderUri: string | null;
}

/**
 * Lists the audio files inside a folder. Implementations are platform-specific
 * (SAF, MediaStore, raw paths) but share this contract.
 */
export interface FileLister {
  listAudioFiles(folder: FolderRef): Promise<ScannedFile[]>;
}

/** Opens the platform folder picker and returns the granted folder, if any. */
export interface FolderPicker {
  pickFolder(): Promise<FolderRef | null>;
}
