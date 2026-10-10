import { migrationState } from "../migrationState";

describe("migrationState", () => {
  it("reports loading while migrations run", () => {
    expect(migrationState({ success: false, error: null }).status).toBe("loading");
  });

  it("reports ready on success", () => {
    expect(migrationState({ success: true, error: null }).status).toBe("ready");
  });

  it("reports error with the message", () => {
    const state = migrationState({ success: false, error: { message: "boom" } });
    expect(state.status).toBe("error");
    expect(state.message).toBe("boom");
  });

  it("lets an error take precedence over success", () => {
    expect(migrationState({ success: true, error: { message: "x" } }).status).toBe(
      "error",
    );
  });
});
