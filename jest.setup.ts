/* eslint-disable @typescript-eslint/no-require-imports */
// Global test setup. Keep native modules stubbed so pure-logic suites can run
// without a device. Suites that exercise native code should provide their own
// focused mocks and assertions.

// Reanimated ships a Jest mock; pulling it in avoids "native module missing".
jest.mock("react-native-reanimated", () => {
  try {
    return require("react-native-reanimated/mock");
  } catch {
    return {};
  }
});

// react-native-audio-api is a native module. Unit tests assert on our
// configuration/derivations, never on real audio output, so a light stub that
// mirrors the Web Audio surface we use is enough.
jest.mock("react-native-audio-api", () => {
  const makeParam = () => ({
    value: 0,
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
    cancelScheduledValues: jest.fn(),
  });

  class BaseNode {
    connect = jest.fn((node: unknown) => node);
    disconnect = jest.fn();
  }

  class BiquadFilterNode extends BaseNode {
    type = "peaking";
    frequency = makeParam();
    gain = makeParam();
    Q = makeParam();
  }

  class GainNode extends BaseNode {
    gain = makeParam();
  }

  class AudioBufferSourceNode extends BaseNode {
    buffer: unknown = null;
    loop = false;
    volume = 1;
    start = jest.fn();
    stop = jest.fn();
    onEnded: (() => void) | null = null;
  }

  const createMockAudioContext = () => ({
    destination: new BaseNode(),
    currentTime: 0,
    sampleRate: 44100,
    state: "suspended",
    createBiquadFilter: jest.fn(() => new BiquadFilterNode()),
    createGain: jest.fn(() => new GainNode()),
    createBufferSource: jest.fn(() => new AudioBufferSourceNode()),
    decodeAudioData: jest.fn(() => Promise.resolve({ duration: 180 })),
    resume: jest.fn(() => Promise.resolve()),
    suspend: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
  });

  return {
    AudioContext: jest.fn().mockImplementation(createMockAudioContext),
    AudioManager: {
      setAudioSessionOptions: jest.fn(),
      setAudioSessionActivity: jest.fn(() => Promise.resolve()),
      observeAudioInterruptions: jest.fn(),
      addSystemEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    PlaybackNotificationManager: {
      show: jest.fn(() => Promise.resolve()),
      hide: jest.fn(() => Promise.resolve()),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      enableControl: jest.fn(() => Promise.resolve()),
    },
    __esModule: true,
  };
});
