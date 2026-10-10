/** Pure helpers behind `Slider`, extracted for unit testing. */

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function ratioFromPosition(x: number, trackWidth: number): number {
  if (trackWidth <= 0) return 0;
  return clamp01(x / trackWidth);
}

export function valueFromRatio(
  ratio: number,
  minimumValue: number,
  maximumValue: number,
): number {
  const r = clamp01(ratio);
  return minimumValue + r * (maximumValue - minimumValue);
}

export function ratioFromValue(
  value: number,
  minimumValue: number,
  maximumValue: number,
): number {
  const range = maximumValue - minimumValue;
  if (range <= 0) return 0;
  return clamp01((value - minimumValue) / range);
}
