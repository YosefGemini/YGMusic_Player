import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import { Screen } from "../Screen";

describe("Screen", () => {
  it("renders children", async () => {
    const { getByText } = await render(
      <Screen>
        <Text>Content</Text>
      </Screen>,
    );
    expect(getByText("Content")).toBeTruthy();
  });

  it("renders children inside a scroll view when requested", async () => {
    const { getByText } = await render(
      <Screen scroll>
        <Text>Scrollable</Text>
      </Screen>,
    );
    expect(getByText("Scrollable")).toBeTruthy();
  });
});
