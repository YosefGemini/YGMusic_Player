/**
 * Extensibility contracts for YGMusic Player.
 *
 * The app is composed of `AppModule`s that declare one or more capabilities.
 * Features depend on these interfaces (not concrete implementations), so new
 * modules can be added without touching consumers.
 *
 * Note: because iOS forbids dynamically loaded native code, "plugins" are
 * modules bundled with the app and toggled on/off. Themes remain fully dynamic
 * data (see `core/theme`).
 */

export type Capability =
  | "audioEffect"
  | "visualizer"
  | "metadataProvider"
  | "libraryScanner"
  | "themeSource"
  | "routeContribution";

export interface ModuleContext {
  /** Simple namespaced logger; avoids a hard dependency on any logging stack. */
  log: (...args: unknown[]) => void;
}

export interface AppModule {
  readonly id: string;
  readonly name: string;
  readonly version?: string;
  readonly capabilities: readonly Capability[];
  /** Called once when the module is bootstrapped. */
  setup?(context: ModuleContext): void | Promise<void>;
  /** Called on shutdown; must release any resources. */
  teardown?(): void | Promise<void>;
}

/** An audio effect inserts a processing stage between a source and a destination. */
export interface AudioEffectModule extends AppModule {
  capabilities: readonly ("audioEffect" | Capability)[];
  /** Higher priority effects are inserted earlier in the chain. */
  priority?: number;
}

export interface VisualizerModule extends AppModule {
  capabilities: readonly ("visualizer" | Capability)[];
}

export interface MetadataProviderModule extends AppModule {
  capabilities: readonly ("metadataProvider" | Capability)[];
}

export interface LibraryScannerModule extends AppModule {
  capabilities: readonly ("libraryScanner" | Capability)[];
}

export interface ThemeSourceModule extends AppModule {
  capabilities: readonly ("themeSource" | Capability)[];
}
