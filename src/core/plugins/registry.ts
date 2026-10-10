import type { AppModule, Capability, ModuleContext } from "./types";

/**
 * In-memory catalog of app modules with enable/disable state.
 *
 * Registration is intentionally strict: ids must be unique and meaningful, so
 * mistakes surface immediately during bootstrap rather than at runtime.
 */
export class ModuleRegistry {
  private readonly modules = new Map<string, AppModule>();
  private readonly order: string[] = [];
  private readonly enabled = new Set<string>();

  register(module: AppModule): void {
    if (this.modules.has(module.id)) {
      throw new Error(`Module with id "${module.id}" is already registered`);
    }
    this.modules.set(module.id, module);
    this.order.push(module.id);
  }

  registerAll(modules: readonly AppModule[]): void {
    for (const module of modules) this.register(module);
  }

  unregister(id: string): boolean {
    if (!this.modules.has(id)) return false;
    this.modules.delete(id);
    this.enabled.delete(id);
    const index = this.order.indexOf(id);
    if (index >= 0) this.order.splice(index, 1);
    return true;
  }

  get(id: string): AppModule | undefined {
    return this.modules.get(id);
  }

  has(id: string): boolean {
    return this.modules.has(id);
  }

  /** All registered modules, in registration order. */
  list(): AppModule[] {
    return this.order.map((id) => this.modules.get(id) as AppModule);
  }

  byCapability(capability: Capability): AppModule[] {
    return this.list().filter((module) => module.capabilities.includes(capability));
  }

  enable(id: string): boolean {
    if (!this.modules.has(id)) return false;
    this.enabled.add(id);
    return true;
  }

  disable(id: string): boolean {
    return this.enabled.delete(id);
  }

  isEnabled(id: string): boolean {
    return this.enabled.has(id);
  }

  enabledModules(): AppModule[] {
    return this.list().filter((module) => this.enabled.has(module.id));
  }

  clear(): void {
    this.modules.clear();
    this.order.length = 0;
    this.enabled.clear();
  }
}

/** Process-wide registry used by the app. Tests should use their own instance. */
export const moduleRegistry = new ModuleRegistry();

/**
 * Registers and starts the given modules in order, returning a `dispose`
 * function that tears them down in reverse order.
 */
export async function bootstrapModules(
  registry: ModuleRegistry,
  modules: readonly AppModule[],
  context: ModuleContext,
): Promise<() => Promise<void>> {
  registry.registerAll(modules);

  for (const module of modules) {
    await module.setup?.(context);
    registry.enable(module.id);
  }

  return async () => {
    for (const module of [...modules].reverse()) {
      await module.teardown?.();
    }
    registry.clear();
  };
}
