import {
  AudioContext,
  PlaybackNotificationManager,
} from "react-native-audio-api";

import { PlayerEngine } from "../playerEngine";

const track = {
  id: "t1",
  uri: "file:///music/song.mp3",
  title: "Song",
  artist: "Artist",
  album: "Album",
  duration: 180,
};

describe("PlayerEngine (spike)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds its own audio context and connects the EQ output to the destination", () => {
    const engine = new PlayerEngine();
    expect(AudioContext).toHaveBeenCalledTimes(1);
    // context.destination is a fresh node each construction; assert the EQ
    // output node connected to *something* (the destination).
    const contextInstance = (AudioContext as jest.Mock).mock.results[0].value;
    const output = engine.equalizer.output as unknown as {
      connect: jest.Mock;
    };
    expect(output.connect).toHaveBeenCalledWith(contextInstance.destination);
    engine.dispose();
  });

  it("loads a track, decodes it, and reflects the paused state", async () => {
    const engine = new PlayerEngine();
    await engine.load(track);

    expect(engine.getCurrentTrack()?.id).toBe("t1");
    expect(engine.getStatus()).toBe("paused");

    const contextInstance = (AudioContext as jest.Mock).mock.results[0].value;
    expect(contextInstance.decodeAudioData).toHaveBeenCalledWith(track.uri);
    expect(contextInstance.createBufferSource).toHaveBeenCalled();
    engine.dispose();
  });

  it("plays, pauses and stops with notification updates", async () => {
    const engine = new PlayerEngine();
    await engine.load(track);

    await engine.play();
    expect(engine.getStatus()).toBe("playing");
    expect(PlaybackNotificationManager.show).toHaveBeenCalled();

    engine.pause();
    expect(engine.getStatus()).toBe("paused");

    engine.stop();
    expect(engine.getStatus()).toBe("idle");
    expect(engine.getCurrentTrack()).toBeNull();
    expect(PlaybackNotificationManager.hide).toHaveBeenCalled();
    engine.dispose();
  });

  it("reports decode failures through the error listener", async () => {
    const onError = jest.fn();
    const engine = new PlayerEngine({ onError });
    const contextInstance = (AudioContext as jest.Mock).mock.results[0].value;
    contextInstance.decodeAudioData.mockRejectedValueOnce(new Error("boom"));

    await engine.load(track);
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(engine.getStatus()).toBe("idle");
    engine.dispose();
  });
});
