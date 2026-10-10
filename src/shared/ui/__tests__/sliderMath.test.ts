import {
  clamp01,
  ratioFromPosition,
  ratioFromValue,
  valueFromRatio,
} from "../sliderMath";

describe("sliderMath", () => {
  it("clamps to the 0..1 range", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(Number.NaN)).toBe(0);
  });

  it("maps a position to a ratio and guards zero width", () => {
    expect(ratioFromPosition(50, 100)).toBe(0.5);
    expect(ratioFromPosition(150, 100)).toBe(1);
    expect(ratioFromPosition(-10, 100)).toBe(0);
    expect(ratioFromPosition(50, 0)).toBe(0);
  });

  it("maps a ratio to a value within [min, max]", () => {
    expect(valueFromRatio(0, 0, 1)).toBe(0);
    expect(valueFromRatio(0.5, 0, 180)).toBe(90);
    expect(valueFromRatio(1, -12, 12)).toBe(12);
    expect(valueFromRatio(2, 0, 10)).toBe(10);
  });

  it("maps a value back to a ratio and guards zero range", () => {
    expect(ratioFromValue(90, 0, 180)).toBeCloseTo(0.5);
    expect(ratioFromValue(0, 0, 10)).toBe(0);
    expect(ratioFromValue(999, 0, 10)).toBe(1);
    expect(ratioFromValue(5, 5, 5)).toBe(0);
  });
});
