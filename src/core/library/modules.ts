import type { AppModule } from "@/core/plugins";
import type { MetadataProvider } from "@/core/metadata";

import { LibraryScanner } from "./scanner";
import type { LibraryServices, LibraryScannerDeps } from "./types";

export function createLibraryServices(deps: LibraryScannerDeps): LibraryServices {
  return { scanner: new LibraryScanner(deps) };
}

/** Registry module exposing the active metadata provider. */
export interface MetadataProviderModule extends AppModule {
  capabilities: readonly ["metadataProvider"];
  provider: MetadataProvider;
}

export function createMetadataProviderModule(
  provider: MetadataProvider,
  id = "metadata.filename",
  name = "Filename metadata",
): MetadataProviderModule {
  return { id, name, capabilities: ["metadataProvider"], provider };
}

/** Registry module exposing the library scanner. */
export interface LibraryScannerModule extends AppModule {
  capabilities: readonly ["libraryScanner"];
  scanner: LibraryScanner;
}

export function createLibraryScannerModule(
  scanner: LibraryScanner,
  id = "library.scanner",
  name = "Library scanner",
): LibraryScannerModule {
  return { id, name, capabilities: ["libraryScanner"], scanner };
}
