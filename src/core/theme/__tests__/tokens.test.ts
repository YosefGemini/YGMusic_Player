import {
  BUILT_IN_THEMES,
  getThemeById,
  hexToRgbTriplet,
  resolveTheme,
  themeToCssVars,
  tripletToColor,
  type ThemeTokens,
} from "../tokens";

describe("theme tokens", () => {
  it("provides a non-empty, uniquely identified built-in theme set", () => {
    expect(BUILT_IN_THEMES.length).toBeGreaterThanOrEqual(2);
    const ids = BUILT_IN_THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("finds themes by id and falls back safely", () => {
    expect(getThemeById("oled")?.name).toBe("OLED Black");
    expect(getThemeById("nope")).toBeUndefined();
    expect(resolveTheme("nope").id).toBe(BUILT_IN_THEMES[0].id);
    expect(resolveTheme(undefined).id).toBe(BUILT_IN_THEMES[0].id);
  });

  it("prefers user-provided custom themes over built-ins", () => {
    const custom: ThemeTokens = {
      ...BUILT_IN_THEMES[0],
      id: "custom",
      name: "Custom",
      colors: { ...BUILT_IN_THEMES[0].colors, primary: "1 2 3" },
    };
    expect(resolveTheme("custom", [custom]).colors.primary).toBe("1 2 3");
  });

  it("maps a theme to CSS variables consumed by global.css", () => {
    const vars = themeToCssVars(BUILT_IN_THEMES[0]);
    expect(vars["--color-background"]).toBe(BUILT_IN_THEMES[0].colors.background);
    expect(vars["--color-primary"]).toBe(BUILT_IN_THEMES[0].colors.primary);
    expect(vars["--radius-theme"]).toBe(`${BUILT_IN_THEMES[0].radius}px`);
  });

  it("converts hex colors to r g b triplets and rejects invalid input", () => {
    expect(hexToRgbTriplet("#ffffff")).toBe("255 255 255");
    expect(hexToRgbTriplet("#000")).toBe("0 0 0");
    expect(hexToRgbTriplet("ff8800")).toBe("255 136 0");
    expect(() => hexToRgbTriplet("#zzz")).toThrow();
    expect(() => hexToRgbTriplet("not-a-color")).toThrow();
  });

  it("converts triplets to CSS color strings", () => {
    expect(tripletToColor("10 10 14")).toBe("rgba(10, 10, 14, 1)");
    expect(tripletToColor("122 92 255", 0.5)).toBe("rgba(122, 92, 255, 0.5)");
  });
});
