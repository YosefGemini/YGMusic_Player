import { PlayerQueue } from "../queue";

const tracks = ["a", "b", "c", "d"];

describe("PlayerQueue", () => {
  it("starts on the requested track in sequential order", () => {
    const queue = new PlayerQueue(tracks, 2);
    expect(queue.currentTrackId).toBe("c");
    expect(queue.currentIndex).toBe(2);
    expect(queue.getSnapshot().order).toEqual([0, 1, 2, 3]);
    expect(queue.getSnapshot().cursor).toBe(2);
  });

  it("advances forwards and stops at the end when repeat is off", () => {
    const queue = new PlayerQueue(tracks, 0);
    expect(queue.next()).toBe(1);
    expect(queue.next()).toBe(2);
    expect(queue.next()).toBe(3);
    expect(queue.next()).toBeNull();
    expect(queue.currentTrackId).toBe("d");
  });

  it("wraps around when repeat is all", () => {
    const queue = new PlayerQueue(tracks, 0, { repeat: "all" });
    queue.next();
    queue.next();
    queue.next();
    expect(queue.currentTrackId).toBe("d");
    expect(queue.next()).toBe(0);
    expect(queue.currentTrackId).toBe("a");
  });

  it("repeats the same track on auto-advance with repeat one, but manual next advances", () => {
    const queue = new PlayerQueue(tracks, 1, { repeat: "one" });
    expect(queue.currentTrackId).toBe("b");
    expect(queue.next(false)).toBe(1);
    expect(queue.currentTrackId).toBe("b");
    expect(queue.next(true)).toBe(2);
    expect(queue.currentTrackId).toBe("c");
  });

  it("moves backwards and wraps only under repeat all", () => {
    const forward = new PlayerQueue(tracks, 0);
    expect(forward.previous()).toBeNull();

    const wrapping = new PlayerQueue(tracks, 0, { repeat: "all" });
    expect(wrapping.previous()).toBe(3);
    expect(wrapping.currentTrackId).toBe("d");
  });

  it("cycles repeat modes off → all → one → off", () => {
    const queue = new PlayerQueue(tracks);
    expect(queue.getRepeat()).toBe("off");
    expect(queue.cycleRepeat()).toBe("all");
    expect(queue.cycleRepeat()).toBe("one");
    expect(queue.cycleRepeat()).toBe("off");
  });

  it("enabling shuffle keeps the current track active and preserves all tracks", () => {
    const queue = new PlayerQueue(tracks, 2);
    queue.setShuffle(true);
    expect(queue.getShuffle()).toBe(true);
    expect(queue.currentTrackId).toBe("c");
    expect([...queue.getSnapshot().order].sort()).toEqual([0, 1, 2, 3]);

    queue.setShuffle(false);
    expect(queue.currentTrackId).toBe("c");
    expect(queue.getSnapshot().order).toEqual([0, 1, 2, 3]);
  });

  it("jumps to a track index and rejects unknown indices", () => {
    const queue = new PlayerQueue(tracks, 0);
    expect(queue.jumpTo(3)).toBe(3);
    expect(queue.currentTrackId).toBe("d");
    expect(queue.jumpTo(99)).toBeNull();
  });

  it("handles an empty library gracefully", () => {
    const queue = new PlayerQueue([], 0);
    expect(queue.currentTrackId).toBeNull();
    expect(queue.next()).toBeNull();
    expect(queue.previous()).toBeNull();
    expect(queue.getSnapshot().cursor).toBe(-1);
  });
});
