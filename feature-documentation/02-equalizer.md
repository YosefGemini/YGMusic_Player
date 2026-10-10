# Feature: 15-band Equalizer

**Status:** Phase 0 (engine + data) · interactive UI in Phase 5

## Purpose
Give the user precise tonal control with a professional-grade 15-band EQ,
plus a preamp and ready-made presets, and the ability to bypass.

## Behavior
- 15 peaking `BiquadFilterNode`s in series, preceded by a preamp gain stage.
- Bands span 25 Hz → 16 kHz (ISO-like spread), each ±12 dB, shared `Q = 1.4`.
- Preamp ranges −12 dB … +6 dB for headroom after boosting.
- 13 built-in presets: Flat, Acoustic, Bass Boost, Bass Reducer, Classical,
  Electronic, Jazz, Pop, Rock, Treble Boost, Vocal, Loudness, Night.
- Bypass zeroes the effective curve but remembers the user's settings.

## Files
- `src/core/audio/equalizer/bands.ts` — frequencies, limits, clamping, validation.
- `src/core/audio/equalizer/presets.ts` — preset definitions + normalization.
- `src/core/audio/equalizer/equalizerGraph.ts` — builds/controls the native chain.

## Contracts
- `createEqualizerGraph(context, bands?, preampDb?)` returns
  `{ input, output, setBandGain, setBands, setPreamp, getBandGain, getPreamp,
  setBypassed, isBypassed, bandCount, dispose }`.
- Connect the source to `input`; connect `output` to the destination (or next effect).
- `setBands` sanitizes arbitrary input back to a legal 15-band curve.
- Out-of-range band indices are ignored (no throw).

## Edge cases
- `NaN`/infinite gains clamp to the minimum.
- `setBands` with a wrong-length array resets to flat.

## Tests
- `__tests__/bands.test.ts` — frequency spread, clamping, validation, sanitizing.
- `__tests__/presets.test.ts` — 15-band shape, range, lookup, normalization.
- `__tests__/equalizerGraph.test.ts` — chain wiring, gain/preamp, bypass, dispose.

## Pending
Interactive EQ screen, live preset editing, persistence to `eq_presets`.
