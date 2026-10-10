import { EQ_BAND_COUNT, EQ_GAIN_MAX_DB, EQ_GAIN_MIN_DB } from "../bands";
import {
  BUILT_IN_EQ_PRESETS,
  getPresetById,
  normalizePreset,
} from "../presets";

describe("built-in EQ presets", () => {
  it("are uniquely identified and non-empty", () => {
    const ids = BUILT_IN_EQ_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("flat");
    expect(BUILT_IN_EQ_PRESETS.length).toBeGreaterThanOrEqual(10);
  });

  it("every preset has exactly 15 bands within range", () => {
    for (const preset of BUILT_IN_EQ_PRESETS) {
      expect(preset.gains).toHaveLength(EQ_BAND_COUNT);
      for (const gain of preset.gains) {
        expect(gain).toBeGreaterThanOrEqual(EQ_GAIN_MIN_DB);
        expect(gain).toBeLessThanOrEqual(EQ_GAIN_MAX_DB);
      }
    }
  });

  it("flat preset is all zeros with no preamp", () => {
    const flat = getPresetById("flat");
    expect(flat?.gains.every((g) => g === 0)).toBe(true);
    expect(flat?.preampDb).toBe(0);
  });

  it("bass boost emphasizes the low end", () => {
    const bass = getPresetById("bass_boost");
    expect(bass).toBeDefined();
    expect(bass!.gains[0]).toBeGreaterThan(0);
    expect(bass!.gains[bass!.gains.length - 1]).toBeLessThanOrEqual(0);
  });

  it("normalizes presets and returns undefined for unknown ids", () => {
    const normalized = normalizePreset({ id: "x", name: "x", gains: [], preampDb: 0 });
    expect(normalized.gains).toHaveLength(EQ_BAND_COUNT);
    expect(getPresetById("does-not-exist")).toBeUndefined();
  });
});
