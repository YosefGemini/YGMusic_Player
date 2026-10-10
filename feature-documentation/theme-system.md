# Feature: Theme system

**Status:** Phase 0 · implemented and tested

## Purpose
Let the player's entire look be swapped at runtime from data, without a rebuild,
so users can install styles/themes and the base UI adapts instantly.

## Behavior
- Ships with three built-in themes: **Midnight**, **OLED Black**, **Daylight**.
- `ThemeProvider` resolves the active theme to CSS custom properties and injects
  them at the root, so Tailwind classes (`bg-background`, `text-primary`, …)
  update live.
- Additional (user) themes can be passed in as `ThemeTokens` — no code changes.

## Files
- `src/core/theme/tokens.ts` — `ThemeTokens`, `ThemeColors`, built-ins,
  `resolveTheme`, `themeToCssVars`, `hexToRgbTriplet`.
- `src/core/theme/ThemeProvider.tsx` — provider + `useTheme()` hook.
- `tailwind.config.js` — maps semantic names to `rgb(var(--color-*) / <alpha-value>)`.
- `global.css` — default variable values.

## Contracts
- Colors are space-separated `r g b` triplets (Tailwind alpha support).
- `resolveTheme(id, extras)` always returns a theme; unknown ids fall back to the
  first built-in.
- Custom themes take precedence over built-ins with the same id.

## Edge cases
- Invalid hex input throws (for theme import validation).
- Missing context throws a clear error from `useTheme()`.

## Tests
`src/core/theme/__tests__/tokens.test.ts` — built-in set, lookup/fallback,
custom-theme precedence, CSS variable mapping, hex conversion (valid + invalid).

## Verified on device
Midnight → OLED Black switch updates background and primary/accent colors live.
