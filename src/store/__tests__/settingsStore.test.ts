import { createSettingsStore } from "../settingsStore";

describe("settingsStore", () => {
  it("has sensible defaults", () => {
    const state = createSettingsStore().getState();
    expect(state.themeId).toBe("midnight");
    expect(state.libraryMode).toBe("device");
  });

  it("updates theme and library mode", () => {
    const store = createSettingsStore();
    store.getState().setThemeId("oled");
    store.getState().setLibraryMode("folder");
    expect(store.getState().themeId).toBe("oled");
    expect(store.getState().libraryMode).toBe("folder");
  });

  it("resets to defaults", () => {
    const store = createSettingsStore();
    store.getState().setThemeId("daylight");
    store.getState().setLibraryMode("folder");
    store.getState().reset();
    expect(store.getState().themeId).toBe("midnight");
    expect(store.getState().libraryMode).toBe("device");
  });
});
