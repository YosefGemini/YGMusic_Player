import { create } from "zustand";

/**
 * How the app is allowed to read the user's music.
 * - `folder`: only folders the user explicitly granted (SAF tree).
 * - `device`: the whole-device audio library (MediaStore).
 */
export type LibraryMode = "folder" | "device";

export interface SettingsState {
  themeId: string;
  libraryMode: LibraryMode;
  setThemeId: (id: string) => void;
  setLibraryMode: (mode: LibraryMode) => void;
  reset: () => void;
}

const INITIAL = {
  themeId: "midnight",
  libraryMode: "device" as LibraryMode,
};

export function createSettingsStore() {
  return create<SettingsState>((set) => ({
    ...INITIAL,
    setThemeId: (themeId) => set({ themeId }),
    setLibraryMode: (libraryMode) => set({ libraryMode }),
    reset: () => set({ ...INITIAL }),
  }));
}

export const useSettingsStore = createSettingsStore();
