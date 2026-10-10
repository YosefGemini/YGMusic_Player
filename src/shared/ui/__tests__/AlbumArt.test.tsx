import { render } from "@testing-library/react-native";
import React from "react";

import { AlbumArt } from "../AlbumArt";

describe("AlbumArt", () => {
  it("renders a fallback when no uri is provided", async () => {
    const { toJSON } = await render(<AlbumArt />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders an image when a uri is provided", async () => {
    const { toJSON } = await render(<AlbumArt uri="file:///art.png" size={80} />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders the vinyl disc variant", async () => {
    const { toJSON } = await render(<AlbumArt uri="file:///art.png" disc />);
    expect(toJSON()).toBeTruthy();
  });
});
