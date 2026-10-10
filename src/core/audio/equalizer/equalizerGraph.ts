import {
  clampGain,
  clampPreamp,
  EQ_FREQUENCIES,
  EQ_Q,
  sanitizeBands,
} from "./bands";

/**
 * Minimal structural types so the graph can be exercised in Jest with a light
 * mock and in the app with the real `react-native-audio-api` nodes.
 */
export interface AudioParamLike {
  setValueAtTime(value: number, startTime: number): unknown;
}

export interface BiquadFilterLike {
  type: string;
  frequency: AudioParamLike;
  Q: AudioParamLike;
  gain: AudioParamLike;
  connect(node: unknown): unknown;
  disconnect(): void;
}

export interface GainNodeLike {
  gain: AudioParamLike;
  connect(node: unknown): unknown;
  disconnect(): void;
}

export interface AudioContextLike {
  readonly destination: unknown;
  createBiquadFilter(): BiquadFilterLike;
  createGain(): GainNodeLike;
}

export interface EqualizerGraph {
  /** Connect the player source here. */
  readonly input: GainNodeLike;
  /** Connect this to the destination (or the next effect in the chain). */
  readonly output: GainNodeLike;
  readonly bandCount: number;
  setBandGain(index: number, db: number): void;
  setBands(bands: number[]): void;
  setPreamp(db: number): void;
  getBandGain(index: number): number;
  getPreamp(): number;
  setBypassed(bypassed: boolean): void;
  isBypassed(): boolean;
  dispose(): void;
}

/**
 * Builds a serial chain of 15 peaking `BiquadFilterNode`s preceded by a preamp
 * gain stage. This is the engine behind the 15-band equalizer and its presets.
 */
export function createEqualizerGraph(
  context: AudioContextLike,
  initialBands: number[] = sanitizeBands([]),
  initialPreampDb = 0,
): EqualizerGraph {
  const bands = sanitizeBands(initialBands);
  const input = context.createGain();
  const preamp = context.createGain();

  const filters: BiquadFilterLike[] = EQ_FREQUENCIES.map((frequency) => {
    const filter = context.createBiquadFilter();
    filter.type = "peaking";
    filter.frequency.setValueAtTime(frequency, 0);
    filter.Q.setValueAtTime(EQ_Q, 0);
    filter.gain.setValueAtTime(0, 0);
    return filter;
  });

  // input -> f0 -> f1 -> ... -> f14 -> preamp
  let previous: unknown = input;
  for (const filter of filters) {
    (previous as BiquadFilterLike).connect(filter);
    previous = filter;
  }
  (previous as BiquadFilterLike).connect(preamp);

  let preampDb = clampPreamp(initialPreampDb);
  let bypassed = false;

  const applyBandEffectiveGain = (index: number): void => {
    const effective = bypassed ? 0 : bands[index];
    filters[index].gain.setValueAtTime(effective, 0);
  };

  const applyPreampEffectiveGain = (): void => {
    preamp.gain.setValueAtTime(bypassed ? 0 : preampDb, 0);
  };

  // Apply initial state.
  bands.forEach((_, index) => applyBandEffectiveGain(index));
  applyPreampEffectiveGain();

  return {
    input,
    output: preamp,
    bandCount: filters.length,
    setBandGain(index, db) {
      if (index < 0 || index >= filters.length) return;
      bands[index] = clampGain(db);
      applyBandEffectiveGain(index);
    },
    setBands(next) {
      const normalized = sanitizeBands(next);
      normalized.forEach((db, index) => {
        bands[index] = db;
        applyBandEffectiveGain(index);
      });
    },
    setPreamp(db) {
      preampDb = clampPreamp(db);
      applyPreampEffectiveGain();
    },
    getBandGain(index) {
      return bands[index] ?? 0;
    },
    getPreamp() {
      return preampDb;
    },
    setBypassed(next) {
      bypassed = next;
      bands.forEach((_, index) => applyBandEffectiveGain(index));
      applyPreampEffectiveGain();
    },
    isBypassed() {
      return bypassed;
    },
    dispose() {
      filters.forEach((filter) => filter.disconnect());
      input.disconnect();
      preamp.disconnect();
    },
  };
}
