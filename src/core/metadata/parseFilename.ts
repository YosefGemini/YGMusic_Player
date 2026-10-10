import { extensionOf } from "@/core/files";

export interface ParsedFilename {
  title: string;
  artist?: string;
  trackNo?: number;
}

function clean(value: string): string {
  return value
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[-.\s]+|[-.\s]+$/g, "")
    .trim();
}

/**
 * Best-effort metadata derived from a file name. Handles the common patterns:
 *   "Artist - Title.mp3"        → artist, title
 *   "Artist - Album - Title.mp3"→ artist, title (album ignored here)
 *   "01 - Title.mp3"            → trackNo, title
 *   "Title.mp3"                 → title
 */
export function parseAudioFilename(fileName: string): ParsedFilename {
  const ext = extensionOf(fileName);
  let base = ext ? fileName.slice(0, fileName.length - ext.length - 1) : fileName;
  base = base.replace(/_/g, " ").trim();

  let trackNo: number | undefined;
  const trackMatch = base.match(/^\s*(\d{1,3})\s*[-.)\]]*\s+(.*)$/);
  if (trackMatch) {
    trackNo = Number(trackMatch[1]);
    base = trackMatch[2];
  }

  const parts = base
    .split(/\s+-\s+/)
    .map((part) => clean(part))
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return { title: clean(base) || "Unknown", trackNo };
  }
  if (parts.length === 1) {
    return { title: parts[0], trackNo };
  }
  return {
    artist: parts[0],
    title: parts[parts.length - 1],
    trackNo,
  };
}
