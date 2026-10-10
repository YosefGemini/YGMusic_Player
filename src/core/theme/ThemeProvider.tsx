import { vars } from "nativewind";
import React, { createContext, useContext, useMemo, type ReactNode } from "react";
import { View } from "react-native";

import {
  BUILT_IN_THEMES,
  resolveTheme,
  themeToCssVars,
  type ThemeTokens,
} from "./tokens";

interface ThemeContextValue {
  theme: ThemeTokens;
  themes: readonly ThemeTokens[];
  setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Active theme id (controlled). */
  themeId: string;
  /** Called when the active theme changes. */
  onThemeIdChange?: (id: string) => void;
  /** Extra (user-installed) themes, merged with the built-ins. */
  themes?: readonly ThemeTokens[];
}

/**
 * Resolves the active theme to CSS variables at the root so every NativeWind
 * `bg-background`, `text-primary`, etc. updates instantly. The selected theme
 * is owned by the app (see `settingsStore`), keeping this provider pure.
 */
export function ThemeProvider({
  children,
  themeId,
  onThemeIdChange,
  themes = BUILT_IN_THEMES,
}: ThemeProviderProps) {
  const theme = useMemo(() => resolveTheme(themeId, themes), [themeId, themes]);
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themes, setThemeId: (id) => onThemeIdChange?.(id) }),
    [theme, themes, onThemeIdChange],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={vars(themeToCssVars(theme))} className="flex-1 bg-background">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
