import { moduleRegistry } from "@/core/plugins";
import {
  createLibraryScannerModule,
  createMetadataProviderModule,
} from "@/core/library";

import { getLibraryDependencies } from "./dependencies";

/** Registers the library feature's modules into the app registry (idempotent). */
export function registerLibraryModules(): void {
  const deps = getLibraryDependencies();
  if (!moduleRegistry.has("metadata.filename")) {
    moduleRegistry.register(createMetadataProviderModule(deps.metadataProvider));
  }
  if (!moduleRegistry.has("library.scanner")) {
    moduleRegistry.register(createLibraryScannerModule(deps.scanner));
  }
}
