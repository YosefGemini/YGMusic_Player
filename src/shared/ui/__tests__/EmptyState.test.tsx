import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("renders title and description", async () => {
    const { getByText } = await render(
      <EmptyState icon="musical-notes" title="No songs" description="Import music" />,
    );
    expect(getByText("No songs")).toBeTruthy();
    expect(getByText("Import music")).toBeTruthy();
  });

  it("renders an optional action", async () => {
    const { getByText } = await render(
      <EmptyState icon="folder" title="Empty" action={<Text>Add folder</Text>} />,
    );
    expect(getByText("Add folder")).toBeTruthy();
  });
});
