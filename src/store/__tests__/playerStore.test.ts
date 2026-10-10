import { createPlayerStore } from "../playerStore";

const tracks = ["a", "b", "c"];

describe("playerStore", () => {
  it("starts empty and paused", () => {
    const store = createPlayerStore().getState();
    expect(store.currentTrackId).toBeNull();
    expect(store.currentIndex).toBe(-1);
    expect(store.isPlaying).toBe(false);
  });

  it("sets a queue and derives the current track", () => {
    const store = createPlayerStore();
    store.getState().setQueue(tracks, 1);
    const state = store.getState();
    expect(state.currentTrackId).toBe("b");
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.duration).toBe(0);
  });

  it("controls playback state", () => {
    const store = createPlayerStore();
    store.getState().setQueue(tracks, 0);
    store.getState().play();
    expect(store.getState().isPlaying).toBe(true);
    store.getState().togglePlay();
    expect(store.getState().isPlaying).toBe(false);
    store.getState().pause();
    expect(store.getState().isPlaying).toBe(false);
  });

  it("advances and reverses through the queue", () => {
    const store = createPlayerStore();
    store.getState().setQueue(tracks, 0);
    store.getState().next();
    expect(store.getState().currentTrackId).toBe("b");
    store.getState().previous();
    expect(store.getState().currentTrackId).toBe("a");
  });

  it("cycles repeat and toggles shuffle", () => {
    const store = createPlayerStore();
    store.getState().setQueue(tracks, 0);
    store.getState().cycleRepeat();
    expect(store.getState().repeat).toBe("all");
    store.getState().cycleRepeat();
    expect(store.getState().repeat).toBe("one");
    store.getState().toggleShuffle();
    expect(store.getState().shuffle).toBe(true);
    expect(store.getState().currentTrackId).toBe("a");
  });

  it("preserves repeat/shuffle when a new queue is set", () => {
    const store = createPlayerStore();
    store.getState().setQueue(tracks, 0);
    store.getState().cycleRepeat();
    store.getState().toggleShuffle();
    store.getState().setQueue(["x", "y"], 0);
    expect(store.getState().repeat).toBe("all");
    expect(store.getState().shuffle).toBe(true);
    expect(store.getState().currentTrackId).toBe("x");
  });

  it("jumps to a track and clamps position", () => {
    const store = createPlayerStore();
    store.getState().setQueue(tracks, 0);
    store.getState().jumpTo(2);
    expect(store.getState().currentTrackId).toBe("c");
    store.getState().setPosition(-5);
    expect(store.getState().position).toBe(0);
    store.getState().setDuration(180);
    expect(store.getState().duration).toBe(180);
  });

  it("clears the queue", () => {
    const store = createPlayerStore();
    store.getState().setQueue(tracks, 0);
    store.getState().play();
    store.getState().clearQueue();
    expect(store.getState().currentTrackId).toBeNull();
    expect(store.getState().isPlaying).toBe(false);
  });
});
