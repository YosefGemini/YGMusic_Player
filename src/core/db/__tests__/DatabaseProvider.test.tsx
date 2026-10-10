import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

const mockUseMigrations = jest.fn();

jest.mock("drizzle-orm/expo-sqlite/migrator", () => ({
  useMigrations: (...args: unknown[]) => mockUseMigrations(...args),
}));
jest.mock("../../../../drizzle/migrations", () => ({
  __esModule: true,
  default: { journal: {}, migrations: {} },
}));
jest.mock("../client", () => ({ db: {} }));

// eslint-disable-next-line import/first
import { DatabaseProvider } from "../DatabaseProvider";

describe("DatabaseProvider", () => {
  it("shows a loading state while migrating", async () => {
    mockUseMigrations.mockReturnValue({ success: false, error: null });
    const { getByText } = await render(
      <DatabaseProvider>
        <Text>Ready</Text>
      </DatabaseProvider>,
    );
    expect(getByText("Preparing your library…")).toBeTruthy();
  });

  it("renders children once migrations succeed", async () => {
    mockUseMigrations.mockReturnValue({ success: true, error: null });
    const { getByText, queryByText } = await render(
      <DatabaseProvider>
        <Text>Ready</Text>
      </DatabaseProvider>,
    );
    expect(getByText("Ready")).toBeTruthy();
    expect(queryByText("Database error")).toBeNull();
  });

  it("shows an error screen on migration failure", async () => {
    mockUseMigrations.mockReturnValue({ success: false, error: { message: "boom" } });
    const { getByText } = await render(
      <DatabaseProvider>
        <Text>Ready</Text>
      </DatabaseProvider>,
    );
    expect(getByText("Database error")).toBeTruthy();
    expect(getByText("boom")).toBeTruthy();
  });
});
