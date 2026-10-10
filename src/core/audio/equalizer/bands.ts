/**
 * Canonical 15-band equalizer definition. Frequencies follow the classic
 * octave-ish ISO spread used by most consumer EQs; bands are ordered low → high.
 */
export const EQ_BAND_COUNT = 15;

export const EQ_FREQUENCIES: readonly number[] = [
  25, 40, 63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 10000,
  16000,
] as const;

/** Per-band gain limits, in decibels. */
export const EQ_GAIN_MIN_DB = -12;
export const EQ_GAIN_MAX_DB = 12;

/** Preamble gain limits (headroom to avoid clipping after boosting bands). */
export const EQ_PREAMP_MIN_DB = -12;
export const EQ_PREAMP_MAX_DB = 6;

/** Filter resonance shared by every peaking band. */
export const EQ_Q = 1.4;

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampGain(db: number): number {
  return clamp(db, EQ_GAIN_MIN_DB, EQ_GAIN_MAX_DB);
}

export function clampPreamp(db: number): number {
  return clamp(db, EQ_PREAMP_MIN_DB, EQ_PREAMP_MAX_DB);
}

export function createFlatBands(): number[] {
  return new Array<number>(EQ_BAND_COUNT).fill(0);
}

export function isValidBandArray(bands: unknown): bands is number[] {
  return (
    Array.isArray(bands) &&
    bands.length === EQ_BAND_COUNT &&
    bands.every((b) => typeof b === "number" && Number.isFinite(b))
  );
}

/** Returns a new array with every band clamped to the legal range. */
export function sanitizeBands(bands: number[]): number[] {
  const source = isValidBandArray(bands) ? bands : createFlatBands();
  return source.map(clampGain);
}

export function frequencyForBand(index: number): number | undefined {
  return EQ_FREQUENCIES[index];
}
