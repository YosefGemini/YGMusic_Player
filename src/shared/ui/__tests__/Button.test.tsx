import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { Button } from "../Button";

describe("Button", () => {
  it("renders its label", async () => {
    const { getByText } = await render(<Button label="Play" />);
    expect(getByText("Play")).toBeTruthy();
  });

  it("fires onPress and ignores presses when disabled", async () => {
    const onPress = jest.fn();
    const { getByText, rerender } = await render(
      <Button label="Tap" onPress={onPress} />,
    );

    await fireEvent.press(getByText("Tap"));
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(<Button label="Tap" onPress={onPress} disabled />);
    await fireEvent.press(getByText("Tap"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
