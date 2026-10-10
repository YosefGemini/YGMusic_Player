# Feature: Module registry (extensibility)

**Status:** Phase 1 · implemented and tested

## Purpose
Provide the extension seam that lets the player grow (new audio effects,
visualizers, scanners, themes, route contributions) without rewiring existing
features. Features depend on capability interfaces, never on concrete modules.

## Behavior
- Modules declare `id`, `name`, optional `version`, and one or more
  `capabilities`.
- A registry catalogs modules in registration order, prevents duplicate ids,
  filters by capability, and tracks enable/disable state.
- `bootstrapModules` registers modules, runs `setup`, enables them, and returns
  a `dispose` that tears them down in reverse and clears the registry.

## Capabilities
`audioEffect`, `visualizer`, `metadataProvider`, `libraryScanner`,
`themeSource`, `routeContribution`.

## Files
- `src/core/plugins/types.ts` — `AppModule`, `Capability`, `ModuleContext`, and
  per-capability interfaces.
- `src/core/plugins/registry.ts` — `ModuleRegistry`, `moduleRegistry` singleton,
  `bootstrapModules`.
- `src/core/plugins/index.ts` — public surface.

## Contracts
- `register(module)` throws on duplicate id.
- `byCapability(cap)` returns matching modules in registration order.
- `enable(id)` returns `false` for unknown ids.
- `bootstrapModules` returns an async disposer; teardown runs in reverse order.

## Design note
Because iOS forbids dynamically loaded native code, "plugins" are modules
bundled with the app and toggled on/off. Themes remain fully dynamic data.

## Tests
`src/core/plugins/__tests__/registry.test.ts` — registration order, duplicate
rejection, unregister/clear, capability filtering, enable/disable, and the
`bootstrapModules` setup/teardown lifecycle.
