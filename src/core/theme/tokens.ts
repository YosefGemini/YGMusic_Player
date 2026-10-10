/**
 * Design tokens for the theme engine. Colors are stored as space-separated
 * `r g b` triplets so NativeWind can apply Tailwind's `<alpha-value>` opacity.
 */
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  foreground: string;
  muted: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  border: string;
}

export interface ThemeTokens {
  id: string;
  name: string;
  description?: string;
  colorScheme: "dark" | "light";
  radius: number;
  colors: ThemeColors;
}

export const BUILT_IN_THEMES: readonly ThemeTokens[] = [
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep violet default",
    colorScheme: "dark",
    radius: 16,
    colors: {
      background: "10 10 14",
      surface: "22 22 30",
      surfaceElevated: "34 34 46",
      foreground: "244 244 248",
      muted: "148 148 164",
      primary: "122 92 255",
      primaryForeground: "255 255 255",
      accent: "0 209 178",
      border: "48 48 62",
    },
  },
  {
    id: "oled",
    name: "OLED Black",
    description: "True black for battery saving",
    colorScheme: "dark",
    radius: 8,
    colors: {
      background: "0 0 0",
      surface: "10 10 10",
      surfaceElevated: "20 20 20",
      foreground: "240 240 240",
      muted: "130 130 130",
      primary: "0 209 178",
      primaryForeground: "0 0 0",
      accent: "255 92 141",
      border: "32 32 32",
    },
  },
  {
    id: "daylight",
    name: "Daylight",
    description: "Bright and clean",
    colorScheme: "light",
    radius: 16,
    colors: {
      background: "247 247 251",
      surface: "255 255 255",
      surfaceElevated: "255 255 255",
      foreground: "18 18 24",
      muted: "110 110 124",
      primary: "90 60 240",
      primaryForeground: "255 255 255",
      accent: "0 150 136",
      border: "226 226 236",
    },
  },
];

export function getThemeById(
  id: string,
  extraThemes: readonly ThemeTokens[] = [],
): ThemeTokens | undefined {
  return (
    [...BUILT_IN_THEMES, ...extraThemes].find((theme) => theme.id === id) ??
    undefined
  );
}

export function resolveTheme(
  id: string | undefined | null,
  extraThemes: readonly ThemeTokens[] = [],
): ThemeTokens {
  if (id) {
    const found = getThemeById(id, extraThemes);
    if (found) return found;
  }
  return BUILT_IN_THEMES[0];
}

/** Maps a theme to the CSS custom properties consumed by `global.css`. */
export function themeToCssVars(theme: ThemeTokens): Record<string, string> {
  return {
    "--color-background": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-surface-elevated": theme.colors.surfaceElevated,
    "--color-foreground": theme.colors.foreground,
    "--color-muted": theme.colors.muted,
    "--color-primary": theme.colors.primary,
    "--color-primary-foreground": theme.colors.primaryForeground,
    "--color-accent": theme.colors.accent,
    "--color-border": theme.colors.border,
    "--radius-theme": `${theme.radius}px`,
  };
}

/** Converts a `r g b` triplet to a CSS `rgb()` / `rgba()` string. */
export function tripletToColor(triplet: string, alpha = 1): string {
  const [r, g, b] = triplet.trim().split(/\s+/).map(Number);
  return `rgba(${r ?? 0}, ${g ?? 0}, ${b ?? 0}, ${alpha})`;
}

/** Converts `#rrggbb` / `#rgb` to a `r g b` triplet; throws on bad input. */
export function hexToRgbTriplet(hex: string): string {
  const value = hex.replace("#", "").trim();
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
