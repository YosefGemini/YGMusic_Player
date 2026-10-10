import {
  clamp,
  clampGain,
  clampPreamp,
  createFlatBands,
  EQ_BAND_COUNT,
  EQ_FREQUENCIES,
  EQ_GAIN_MAX_DB,
  EQ_GAIN_MIN_DB,
  EQ_PREAMP_MAX_DB,
  EQ_PREAMP_MIN_DB,
  frequencyForBand,
  isValidBandArray,
  sanitizeBands,
} from "../bands";

describe("equalizer bands", () => {
  it("declares exactly 15 ascending frequencies", () => {
    expect(EQ_BAND_COUNT).toBe(15);
    expect(EQ_FREQUENCIES).toHaveLength(15);
    const sorted = [...EQ_FREQUENCIES].sort((a, b) => a - b);
    expect([...EQ_FREQUENCIES]).toEqual(sorted);
    expect(EQ_FREQUENCIES[0]).toBe(25);
    expect(EQ_FREQUENCIES[14]).toBe(16000);
  });

  it("creates a flat 15-band curve", () => {
    const flat = createFlatBands();
    expect(flat).toHaveLength(15);
    expect(flat.every((g) => g === 0)).toBe(true);
  });

  it("clamps gains to the legal range", () => {
    expect(clampGain(100)).toBe(EQ_GAIN_MAX_DB);
    expect(clampGain(-100)).toBe(EQ_GAIN_MIN_DB);
    expect(clampGain(3)).toBe(3);
    expect(clampGain(Number.NaN)).toBe(EQ_GAIN_MIN_DB);
    expect(clampPreamp(100)).toBe(EQ_PREAMP_MAX_DB);
    expect(clampPreamp(-100)).toBe(EQ_PREAMP_MIN_DB);
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("validates band arrays", () => {
    expect(isValidBandArray(createFlatBands())).toBe(true);
    expect(isValidBandArray([0, 1, 2])).toBe(false);
    expect(isValidBandArray(null)).toBe(false);
    expect(isValidBandArray(new Array(15).fill("x"))).toBe(false);
  });

  it("sanitizes malformed input back to a legal 15-band curve", () => {
    expect(sanitizeBands([])).toEqual(createFlatBands());
    expect(sanitizeBands([999, ...new Array(14).fill(-999)])).toEqual([
      EQ_GAIN_MAX_DB,
      ...new Array(14).fill(EQ_GAIN_MIN_DB),
    ]);
  });

  it("resolves a frequency by band index", () => {
    expect(frequencyForBand(0)).toBe(25);
    expect(frequencyForBand(999)).toBeUndefined();
  });
});
