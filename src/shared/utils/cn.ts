export type ClassValue = string | false | null | undefined;

/** Minimal className joiner (avoids a clsx dependency). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
