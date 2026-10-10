import { createFlatBands, EQ_BAND_COUNT, sanitizeBands } from "./bands";

export interface EqPresetDefinition {
  id: string;
  name: string;
  /** 15 preamp-adjusted band gains in dB, low → high frequency. */
  gains: number[];
  preampDb: number;
}

/**
 * A band value of `n` dB. Helper keeps the preset table readable.
 */
function bands(get: (index: number) => number): number[] {
  return Array.from({ length: EQ_BAND_COUNT }, (_, index) => get(index));
}

export const BUILT_IN_EQ_PRESETS: readonly EqPresetDefinition[] = [
  { id: "flat", name: "Flat", gains: createFlatBands(), preampDb: 0 },
  {
    id: "acoustic",
    name: "Acoustic",
    preampDb: -1,
    gains: bands((i) => [3, 2, 1, 1, 2, 3, 2, 1, 0, -1, -1, 0, 1, 2, 2][i]),
  },
  {
    id: "bass_boost",
    name: "Bass Boost",
    preampDb: -3,
    gains: bands((i) => [7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0][i]),
  },
  {
    id: "bass_reducer",
    name: "Bass Reducer",
    preampDb: 0,
    gains: bands((i) => [-6, -5, -4, -3, -2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0][i]),
  },
  {
    id: "classical",
    name: "Classical",
    preampDb: -1,
    gains: bands((i) => [0, 0, 0, 0, 0, 0, -2, -2, -1, 0, 2, 3, 3, 3, 3][i]),
  },
  {
    id: "electronic",
    name: "Electronic",
    preampDb: -2,
    gains: bands((i) => [5, 4, 2, 1, 0, -1, -2, -1, 0, 1, 2, 3, 4, 5, 5][i]),
  },
  {
    id: "jazz",
    name: "Jazz",
    preampDb: -1,
    gains: bands((i) => [3, 2, 1, 1, -1, -1, 0, 1, 2, 2, 2, 2, 2, 2, 3][i]),
  },
  {
    id: "pop",
    name: "Pop",
    preampDb: -2,
    gains: bands((i) => [-1, 0, 2, 3, 3, 2, 1, 0, 0, 1, 2, 3, 3, 2, 1][i]),
  },
  {
    id: "rock",
    name: "Rock",
    preampDb: -2,
    gains: bands((i) => [5, 4, 3, 2, 1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5][i]),
  },
  {
    id: "treble_boost",
    name: "Treble Boost",
    preampDb: -2,
    gains: bands((i) => [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6][i]),
  },
  {
    id: "vocal",
    name: "Vocal",
    preampDb: -1,
    gains: bands((i) => [-2, -2, -1, 0, 2, 3, 4, 3, 2, 1, 0, 0, 1, 1, 1][i]),
  },
  {
    id: "loudness",
    name: "Loudness",
    preampDb: -3,
    gains: bands((i) => [4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4][i]),
  },
  {
    id: "night",
    name: "Night",
    preampDb: 0,
    gains: bands((i) => [-3, -3, -2, -2, -1, -1, 0, 1, 1, 2, 3, 3, 2, 1, 0][i]),
  },
] as const;

export function getPresetById(id: string): EqPresetDefinition | undefined {
  return BUILT_IN_EQ_PRESETS.find((preset) => preset.id === id);
}

/** Validates and normalizes a preset's bands before it reaches the audio graph. */
export function normalizePreset(preset: EqPresetDefinition): EqPresetDefinition {
  return { ...preset, gains: sanitizeBands(preset.gains) };
}
