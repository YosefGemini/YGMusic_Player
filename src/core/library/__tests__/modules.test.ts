import { ModuleRegistry } from "@/core/plugins";
import { FilenameMetadataProvider } from "@/core/metadata";

import {
  createLibraryScannerModule,
  createLibraryServices,
  createMetadataProviderModule,
} from "../index";
import { LibraryScanner } from "../scanner";

describe("library services and modules", () => {
  it("creates library services with a scanner", () => {
    const services = createLibraryServices({
      fileLister: { listAudioFiles: async () => [] },
      metadataProvider: new FilenameMetadataProvider(),
      repository: {
        getScanCacheEntry: async () => null,
        upsertScanCache: async () => {},
        deleteScanCache: async () => {},
        upsertTrack: async () => "created",
        listTrackUrisInFolder: async () => [],
        deleteTrackByUri: async () => {},
      },
    });
    expect(services.scanner).toBeInstanceOf(LibraryScanner);
  });

  it("registers metadata + scanner modules by capability", () => {
    const registry = new ModuleRegistry();
    const provider = new FilenameMetadataProvider();
    const scanner = new LibraryScanner({
      fileLister: { listAudioFiles: async () => [] },
      metadataProvider: provider,
      repository: {
        getScanCacheEntry: async () => null,
        upsertScanCache: async () => {},
        deleteScanCache: async () => {},
        upsertTrack: async () => "created",
        listTrackUrisInFolder: async () => [],
        deleteTrackByUri: async () => {},
      },
    });

    registry.registerAll([
      createMetadataProviderModule(provider),
      createLibraryScannerModule(scanner),
    ]);

    expect(registry.byCapability("metadataProvider").map((m) => m.id)).toEqual([
      "metadata.filename",
    ]);
    expect(registry.byCapability("libraryScanner").map((m) => m.id)).toEqual([
      "library.scanner",
    ]);
  });
});
