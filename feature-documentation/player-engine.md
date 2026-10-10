# Feature: Player engine

**Status:** Phase 0 · **spike** (productionized in Phase 4)

## Purpose
Prove the end-to-end audio path and own the native playback resources:
decode a file, route it through the 15-band equalizer, play/pause/stop, and
drive background playback plus the media notification.

## Behavior
- Creates and owns a single `AudioContext`.
- Builds the equalizer graph and connects `equalizer.output → destination`.
- Configures the audio session (iOS playback category, Android audio focus) and
  subscribes to interruptions (auto-pause/resume).
- Wires remote controls (`PlaybackNotificationManager` play/pause events) and
  shows/updates/hides the media notification with track metadata.
- `load(track)` decodes a local file and prepares it for playback.

## Files
`src/core/audio/player/playerEngine.ts`

## Contracts
- `new PlayerEngine({ onStatusChange, onTrackChange, onError })`.
- `load(track)`, `play()`, `pause()`, `stop()`, `setVolume(v)`, `dispose()`.
- Exposes `equalizer` and `getStatus()` / `getCurrentTrack()`.
- Insertion point for effects is always `source → equalizer.input`.

## Known limitations (spike)
- Uses `decodeAudioData`, which holds a whole file in memory. Production will use
  the library's streaming `<Audio>` / `AudioFileSourceNode` path; the effect
  insertion point stays identical.
- `play()` after `pause()` restarts from the buffer; precise resume/seek lands
  with the streaming path in Phase 4.

## Tests
`src/core/audio/player/__tests__/playerEngine.test.ts` — EQ→destination wiring,
load/decode + paused state, play/pause/stop + notification calls, decode-error
reporting. Native module faked in `jest.setup.ts`.

## Verified on device
Tapping "Initialize native audio graph" logged `OboeAudio … openStreamInternal()`
and `requestAudioFocus()` from `com.swmansion.audioapi`; the UI reported the
context ready with 15 EQ bands wired.
