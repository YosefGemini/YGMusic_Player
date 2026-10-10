/** Audio file formats the scanner is willing to import. */
export const AUDIO_EXTENSIONS = [
  "mp3",
  "m4a",
  "mp4",
  "aac",
  "flac",
  "ogg",
  "oga",
  "opus",
  "wav",
  "wma",
  "aiff",
  "aif",
  "alac",
] as const;

export type AudioExtension = (typeof AUDIO_EXTENSIONS)[number];

/** Returns the lowercased extension (without the dot) of a file name. */
export function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  if (dot <= 0 || dot === fileName.length - 1) return "";
  return fileName.slice(dot + 1).toLowerCase();
}

export function isAudioExtension(extension: string): boolean {
  return (AUDIO_EXTENSIONS as readonly string[]).includes(
    extension.toLowerCase().replace(/^\./, ""),
  );
}

export function isAudioFileName(fileName: string): boolean {
  return isAudioExtension(extensionOf(fileName));
}
