# Feature: Design system

**Status:** Phase 1 · implemented and tested

## Purpose
A small set of themed, reusable UI primitives so features stay visually
consistent and the theme system drives every element.

## Components (`src/shared/ui`)
- **`Screen`** — safe-area container with optional scroll and padding.
- **`Button`** — variants (`primary`, `secondary`, `ghost`, `accent`) and sizes
  (`sm`, `md`, `lg`); `active:` feedback; disabled state.
- **`Slider`** — dependency-free track slider (tap/drag) with an accessible
  value; math extracted to `sliderMath`.
- **`AlbumArt`** — cover image with fallback icon and an optional vinyl "disc"
  frame.
- **`ScreenHeader`** — large title/subtitle with a settings shortcut.
- **`EmptyState`** — icon + title + description + optional action.
- **`Ionicons`** (`icons.ts`) — `@expo/vector-icons` wrapped with NativeWind
  `cssInterop` so `className="text-*"` colors the glyph via the theme.
- **`cn`** (`shared/utils`) — minimal className joiner.

## Contracts
- All components read colors from theme CSS variables (`bg-primary`,
  `text-foreground`, …) — no hard-coded colors.
- `sliderMath`: `clamp01`, `ratioFromPosition`, `valueFromRatio`,
  `ratioFromValue` (all pure and guarded against zero width/range).

## Notable fix
Ionicons ignored `className` colors; `cssInterop(..., { className: { target:
"style", nativeStyleToProp: { color: true } } })` maps the color style to the
icon's `color` prop. The wrapper preserves the original icon typing via a cast.

## Tests
- `__tests__/sliderMath.test.ts` — mapping/clamping edge cases.
- `__tests__/Button.test.tsx` — label, press, disabled.
- `__tests__/Screen.test.tsx`, `EmptyState.test.tsx`, `ScreenHeader.test.tsx`,
  `AlbumArt.test.tsx`, `Slider.test.tsx` — render/behavior.

## Test infrastructure
`__mocks__/@expo/vector-icons.tsx` stubs the icon package (its real
implementation loads expo-font native internals unavailable under Jest).
