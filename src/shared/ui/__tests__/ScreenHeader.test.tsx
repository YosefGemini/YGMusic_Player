import { render } from "@testing-library/react-native";
import React from "react";

import { ScreenHeader } from "../ScreenHeader";

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe("ScreenHeader", () => {
  it("renders the title and subtitle", async () => {
    const { getByText } = await render(
      <ScreenHeader title="Albums" subtitle="Cover art" />,
    );
    expect(getByText("Albums")).toBeTruthy();
    expect(getByText("Cover art")).toBeTruthy();
  });

  it("hides the settings shortcut when disabled", async () => {
    const { queryByLabelText } = await render(
      <ScreenHeader title="Songs" showSettings={false} />,
    );
    expect(queryByLabelText("Settings")).toBeNull();
  });
});
