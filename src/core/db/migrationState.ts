export type MigrationStatus = "loading" | "ready" | "error";

export interface MigrationState {
  status: MigrationStatus;
  message?: string;
}

export interface MigrationInput {
  success: boolean;
  error?: { message: string } | null;
}

/** Pure decision function for the database migration gate (unit-testable). */
export function migrationState({ success, error }: MigrationInput): MigrationState {
  if (error) return { status: "error", message: error.message };
  if (success) return { status: "ready" };
  return { status: "loading" };
}
