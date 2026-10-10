import type { ScannedFile } from "@/core/files";

import { FilenameMetadataProvider } from "../providers/filenameProvider";

const file = (fileName: string): ScannedFile => ({
  uri: `file:///music/${fileName}`,
  fileName,
  extension: fileName.split(".").pop() ?? "",
  sizeBytes: 1,
  mtimeMs: 1,
  parentFolderUri: "file:///music",
});

describe("FilenameMetadataProvider", () => {
  it("derives artist and title from the file name", async () => {
    const provider = new FilenameMetadataProvider();
    await expect(provider.readMetadata(file("Adele - Hello.mp3"))).resolves.toEqual({
      title: "Hello",
      artist: "Adele",
      trackNo: undefined,
    });
  });

  it("captures a leading track number", async () => {
    const provider = new FilenameMetadataProvider();
    const metadata = await provider.readMetadata(file("02 Track.flac"));
    expect(metadata.trackNo).toBe(2);
    expect(metadata.title).toBe("Track");
  });
});
