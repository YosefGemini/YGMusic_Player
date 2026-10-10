import { create } from "zustand";

import { PlayerQueue, type RepeatMode } from "@/core/audio/player/queue";

export interface PlayerState {
  /** The active queue instance. Mutated via actions; derived fields below stay in sync. */
  queue: PlayerQueue;
  currentTrackId: string | null;
  currentIndex: number;
  isPlaying: boolean;
  repeat: RepeatMode;
  shuffle: boolean;
  position: number;
  duration: number;

  setQueue: (trackIds: string[], startIndex?: number) => void;
  clearQueue: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  jumpTo: (trackIndex: number) => void;
  setPosition: (seconds: number) => void;
  setDuration: (seconds: number) => void;
}

function derived(queue: PlayerQueue) {
  const snapshot = queue.getSnapshot();
  return {
    currentTrackId: snapshot.currentTrackId,
    currentIndex: snapshot.currentIndex,
    repeat: snapshot.repeat,
    shuffle: snapshot.shuffle,
  };
}

export function createPlayerStore() {
  return create<PlayerState>((set, get) => ({
    queue: new PlayerQueue([]),
    currentTrackId: null,
    currentIndex: -1,
    isPlaying: false,
    repeat: "off",
    shuffle: false,
    position: 0,
    duration: 0,

    setQueue: (trackIds, startIndex = 0) => {
      const { repeat, shuffle } = get();
      const queue = new PlayerQueue(trackIds, startIndex, { repeat, shuffle });
      set({ queue, ...derived(queue), position: 0, duration: 0 });
    },

    clearQueue: () => {
      const queue = new PlayerQueue([]);
      set({
        queue,
        ...derived(queue),
        isPlaying: false,
        position: 0,
        duration: 0,
      });
    },

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    next: () => {
      get().queue.next(true);
      set(derived(get().queue));
    },

    previous: () => {
      get().queue.previous();
      set(derived(get().queue));
    },

    cycleRepeat: () => {
      get().queue.cycleRepeat();
      set(derived(get().queue));
    },

    toggleShuffle: () => {
      get().queue.toggleShuffle();
      set(derived(get().queue));
    },

    jumpTo: (trackIndex) => {
      get().queue.jumpTo(trackIndex);
      set(derived(get().queue));
    },

    setPosition: (seconds) => set({ position: Math.max(0, seconds) }),
    setDuration: (seconds) => set({ duration: Math.max(0, seconds) }),
  }));
}

export const usePlayerStore = createPlayerStore();
