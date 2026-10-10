import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import { ThemeProvider, useTheme } from "../ThemeProvider";

function Probe() {
  const { theme, setThemeId } = useTheme();
  return (
    <>
      <Text>{theme.id}</Text>
      <Text onPress={() => setThemeId("oled")}>switch</Text>
    </>
  );
}

describe("ThemeProvider", () => {
  it("provides the resolved theme to children", async () => {
    const { getByText } = await render(
      <ThemeProvider themeId="midnight">
        <Probe />
      </ThemeProvider>,
    );
    expect(getByText("midnight")).toBeTruthy();
  });

  it("notifies the owner when the theme changes", async () => {
    const onThemeIdChange = jest.fn();
    const { getByText, rerender } = await render(
      <ThemeProvider themeId="midnight" onThemeIdChange={onThemeIdChange}>
        <Probe />
      </ThemeProvider>,
    );

    await fireEvent.press(getByText("switch"));
    expect(onThemeIdChange).toHaveBeenCalledWith("oled");

    await rerender(
      <ThemeProvider themeId="oled" onThemeIdChange={onThemeIdChange}>
        <Probe />
      </ThemeProvider>,
    );
    expect(getByText("oled")).toBeTruthy();
  });

  it("throws when useTheme is used outside a provider", async () => {
    // Silence the expected React error boundary log.
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(render(<Probe />)).rejects.toThrow("ThemeProvider");
    spy.mockRestore();
  });
});
