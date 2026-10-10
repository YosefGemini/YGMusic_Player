import { parseAudioFilename } from "../parseFilename";

describe("parseAudioFilename", () => {
  it("parses artist - title", () => {
    expect(parseAudioFilename("Daft Punk - Aerodynamic.mp3")).toEqual({
      artist: "Daft Punk",
      title: "Aerodynamic",
    });
  });

  it("strips a leading track number", () => {
    expect(parseAudioFilename("01 - Intro.flac")).toEqual({
      title: "Intro",
      trackNo: 1,
    });
    expect(parseAudioFilename("07 Title.wav")).toEqual({
      title: "Title",
      trackNo: 7,
    });
  });

  it("uses the first and last parts for multi-dash names", () => {
    expect(parseAudioFilename("Artist - Album - Song.m4a")).toEqual({
      artist: "Artist",
      title: "Song",
    });
  });

  it("converts underscores and collapses whitespace", () => {
    expect(parseAudioFilename("my__great_song.mp3")).toEqual({
      title: "my great song",
    });
  });

  it("falls back to the raw name when there is nothing to parse", () => {
    expect(parseAudioFilename("---.mp3").title).toBe("Unknown");
  });

  it("works without an extension", () => {
    expect(parseAudioFilename("JustAName")).toEqual({ title: "JustAName" });
  });
});
