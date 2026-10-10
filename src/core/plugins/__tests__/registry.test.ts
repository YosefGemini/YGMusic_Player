import { ModuleRegistry, bootstrapModules } from "../registry";
import type { AppModule, ModuleContext } from "../types";

function makeModule(id: string, caps: AppModule["capabilities"] = []): AppModule {
  return { id, name: id, capabilities: caps };
}

describe("ModuleRegistry", () => {
  it("registers and lists modules in order", () => {
    const registry = new ModuleRegistry();
    const a = makeModule("a");
    const b = makeModule("b");
    registry.register(a);
    registry.register(b);
    expect(registry.list()).toEqual([a, b]);
    expect(registry.has("a")).toBe(true);
    expect(registry.get("b")).toBe(b);
  });

  it("rejects duplicate ids", () => {
    const registry = new ModuleRegistry();
    registry.register(makeModule("dup"));
    expect(() => registry.register(makeModule("dup"))).toThrow(/already registered/);
  });

  it("unregisters modules and clears enable state", () => {
    const registry = new ModuleRegistry();
    registry.register(makeModule("a"));
    registry.enable("a");
    expect(registry.unregister("a")).toBe(true);
    expect(registry.unregister("a")).toBe(false);
    expect(registry.has("a")).toBe(false);
    expect(registry.isEnabled("a")).toBe(false);
  });

  it("filters by capability", () => {
    const registry = new ModuleRegistry();
    registry.registerAll([
      makeModule("eq", ["audioEffect"]),
      makeModule("viz", ["visualizer"]),
      makeModule("both", ["audioEffect", "visualizer"]),
    ]);
    expect(registry.byCapability("audioEffect").map((m) => m.id)).toEqual([
      "eq",
      "both",
    ]);
    expect(registry.byCapability("visualizer").map((m) => m.id)).toEqual([
      "viz",
      "both",
    ]);
  });

  it("toggles enable state", () => {
    const registry = new ModuleRegistry();
    registry.register(makeModule("a"));
    expect(registry.isEnabled("a")).toBe(false);
    expect(registry.enable("a")).toBe(true);
    expect(registry.isEnabled("a")).toBe(true);
    expect(registry.enabledModules().map((m) => m.id)).toEqual(["a"]);
    expect(registry.disable("a")).toBe(true);
    expect(registry.isEnabled("a")).toBe(false);
    expect(registry.enable("missing")).toBe(false);
  });

  it("clear removes everything", () => {
    const registry = new ModuleRegistry();
    registry.registerAll([makeModule("a"), makeModule("b")]);
    registry.enable("a");
    registry.clear();
    expect(registry.list()).toEqual([]);
    expect(registry.isEnabled("a")).toBe(false);
  });
});

describe("bootstrapModules", () => {
  it("sets up, enables, and tears down modules in reverse order", async () => {
    const registry = new ModuleRegistry();
    const calls: string[] = [];
    const context: ModuleContext = { log: () => {} };

    const modules: AppModule[] = [
      {
        id: "a",
        name: "a",
        capabilities: [],
        setup: () => void calls.push("setup-a"),
        teardown: () => void calls.push("teardown-a"),
      },
      {
        id: "b",
        name: "b",
        capabilities: [],
        setup: () => void calls.push("setup-b"),
        teardown: () => void calls.push("teardown-b"),
      },
    ];

    const dispose = await bootstrapModules(registry, modules, context);
    expect(calls).toEqual(["setup-a", "setup-b"]);
    expect(registry.enabledModules().map((m) => m.id)).toEqual(["a", "b"]);

    await dispose();
    expect(calls).toEqual(["setup-a", "setup-b", "teardown-b", "teardown-a"]);
    expect(registry.list()).toEqual([]);
  });
});
