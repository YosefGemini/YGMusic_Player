import { render } from "@testing-library/react-native";
import React from "react";

import { Slider } from "../Slider";

describe("Slider", () => {
  it("renders with an accessible value", async () => {
    const { getByLabelText } = await render(
      <Slider value={5} minimumValue={0} maximumValue={10} accessibilityLabel="Volume" />,
    );
    const slider = getByLabelText("Volume");
    expect(slider.props.accessibilityValue).toEqual({ min: 0, max: 10, now: 5 });
  });
});
