export type RepeatMode = "off" | "all" | "one";

export interface PlayerQueueOptions {
  repeat?: RepeatMode;
  shuffle?: boolean;
}

export interface PlayerQueueSnapshot {
  trackIds: string[];
  order: number[];
  cursor: number;
  repeat: RepeatMode;
  shuffle: boolean;
  currentTrackId: string | null;
  currentIndex: number;
}

function sequentialIndices(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i);
}

function shuffledIndices(count: number, firstIndex: number): number[] {
  const rest: number[] = [];
  for (let i = 0; i < count; i += 1) {
    if (i !== firstIndex) rest.push(i);
  }
  for (let i = rest.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  if (firstIndex >= 0 && firstIndex < count) return [firstIndex, ...rest];
  return rest;
}

/**
 * Pure, framework-free playback queue. Encapsulates repeat modes
 * (off / all / one) and shuffle, so the player engine stays a thin wrapper.
 *
 * `order` holds indices into `trackIds` in playback order; `cursor` is the
 * position within `order`. Sequential playback uses the natural order and sets
 * `cursor` to the start index; shuffle places the current track first.
 */
export class PlayerQueue {
  private trackIds: string[];
  private order: number[];
  private cursor: number;
  private repeat: RepeatMode;
  private shuffle: boolean;

  constructor(
    trackIds: string[],
    startIndex = 0,
    options: PlayerQueueOptions = {},
  ) {
    this.trackIds = [...trackIds];
    this.repeat = options.repeat ?? "off";
    this.shuffle = options.shuffle ?? false;

    const count = this.trackIds.length;
    if (count === 0) {
      this.order = [];
      this.cursor = -1;
      return;
    }

    const safeStart = Math.max(0, Math.min(startIndex, count - 1));
    if (this.shuffle) {
      this.order = shuffledIndices(count, safeStart);
      this.cursor = 0;
    } else {
      this.order = sequentialIndices(count);
      this.cursor = safeStart;
    }
  }

  get size(): number {
    return this.trackIds.length;
  }

  get currentIndex(): number {
    return this.cursor >= 0 ? this.order[this.cursor] : -1;
  }

  get currentTrackId(): string | null {
    const index = this.currentIndex;
    return index >= 0 ? (this.trackIds[index] ?? null) : null;
  }

  getRepeat(): RepeatMode {
    return this.repeat;
  }

  getShuffle(): boolean {
    return this.shuffle;
  }

  /**
   * Advances one track. `manual` reflects a user pressing "next" (which should
   * advance even under repeat-one). Returns the new index or `null` at the end.
   */
  next(manual = false): number | null {
    if (this.cursor < 0) return null;

    if (this.repeat === "one" && !manual) {
      return this.currentIndex;
    }

    if (this.cursor < this.order.length - 1) {
      this.cursor += 1;
      return this.currentIndex;
    }

    if (this.repeat === "all") {
      this.cursor = 0;
      return this.currentIndex;
    }

    return null;
  }

  previous(): number | null {
    if (this.cursor < 0) return null;

    if (this.cursor > 0) {
      this.cursor -= 1;
      return this.currentIndex;
    }

    if (this.repeat === "all") {
      this.cursor = this.order.length - 1;
      return this.currentIndex;
    }

    return null;
  }

  setRepeat(mode: RepeatMode): void {
    this.repeat = mode;
  }

  /** Cycles off → all → one → off, matching the in-app transport button. */
  cycleRepeat(): RepeatMode {
    this.repeat =
      this.repeat === "off" ? "all" : this.repeat === "all" ? "one" : "off";
    return this.repeat;
  }

  setShuffle(enabled: boolean): void {
    if (enabled === this.shuffle || this.trackIds.length === 0) return;
    const current = this.currentIndex;
    this.shuffle = enabled;

    if (enabled) {
      this.order = shuffledIndices(this.trackIds.length, current < 0 ? 0 : current);
      this.cursor = 0;
    } else {
      this.order = sequentialIndices(this.trackIds.length);
      this.cursor = current < 0 ? -1 : this.order.indexOf(current);
    }
  }

  toggleShuffle(): boolean {
    this.setShuffle(!this.shuffle);
    return this.shuffle;
  }

  /** Jumps to a track index within `trackIds`. Returns the new index or null. */
  jumpTo(trackIndex: number): number | null {
    const position = this.order.indexOf(trackIndex);
    if (position < 0) return null;
    this.cursor = position;
    return this.currentIndex;
  }

  getSnapshot(): PlayerQueueSnapshot {
    return {
      trackIds: [...this.trackIds],
      order: [...this.order],
      cursor: this.cursor,
      repeat: this.repeat,
      shuffle: this.shuffle,
      currentTrackId: this.currentTrackId,
      currentIndex: this.currentIndex,
    };
  }
}
