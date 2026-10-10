import {
  AUDIO_EXTENSIONS,
  extensionOf,
  isAudioExtension,
  isAudioFileName,
} from "../audioExtensions";

describe("audio extensions", () => {
  it("extracts the lowercased extension", () => {
    expect(extensionOf("Song.MP3")).toBe("mp3");
    expect(extensionOf("no-extension")).toBe("");
    expect(extensionOf("a.b.c.flac")).toBe("flac");
    expect(extensionOf("trailing.")).toBe("");
    expect(extensionOf(".hidden")).toBe("");
  });

  it("recognizes audio extensions with or without a dot", () => {
    expect(isAudioExtension("mp3")).toBe(true);
    expect(isAudioExtension(".FLAC")).toBe(true);
    expect(isAudioExtension("txt")).toBe(false);
  });

  it("recognizes audio file names", () => {
    expect(isAudioFileName("Artist - Title.mp3")).toBe(true);
    expect(isAudioFileName("cover.jpg")).toBe(false);
    expect(AUDIO_EXTENSIONS).toContain("flac");
  });
});
