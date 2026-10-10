import { vars } from "nativewind";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
  initialThemeId?: string;
  themes?: readonly ThemeTokens[];
}

/**
 * Resolves the active theme to CSS variables at the root so every NativeWind
 * `bg-background`, `text-foreground`, `text-primary`, etc. updates instantly.
 * Additional (user-installed) themes can be passed via `themes`.
 */
export function ThemeProvider({
  children,
  initialThemeId = "midnight",
  themes = BUILT_IN_THEMES,
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState(initialThemeId);
  const theme = useMemo(() => resolveTheme(themeId, themes), [themeId, themes]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themes, setThemeId }),
    [theme, themes],
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
