/**
 * Extract the PostgreSQL error cause from a Drizzle/Neon error
 */
const getPgErrorCause = (error: unknown): Record<string, unknown> | null => {
  if (error === null || typeof error !== "object") return null;

  // Check direct (some drivers surface it top-level)
  if ("code" in error) return error as Record<string, unknown>;

  // Check nested cause (Drizzle/Neon wraps it here)
  if (
    "cause" in error &&
    error.cause !== null &&
    typeof error.cause === "object" &&
    "code" in error.cause
  ) {
    return error.cause as Record<string, unknown>;
  }

  return null;
};

/**
 * 23505 - Unique constraint violation
 */
export const isDatabaseUniqueError = (
  error: unknown,
  constraint?: string,
): boolean => {
  const cause = getPgErrorCause(error);
  if (!cause || cause.code !== "23505") return false;
  if (constraint) return cause.constraint === constraint;
  return true;
};

/**
 * 23503 - Foreign key constraint violation
 */
export const isDatabaseForeignKeyError = (
  error: unknown,
  constraint?: string,
): boolean => {
  const cause = getPgErrorCause(error);
  if (!cause || cause.code !== "23503") return false;
  if (constraint) return cause.constraint === constraint;
  return true;
};

/**
 * 23502 - Not null constraint violation
 */
export const isDatabaseNotNullError = (
  error: unknown,
  column?: string,
): boolean => {
  const cause = getPgErrorCause(error);
  if (!cause || cause.code !== "23502") return false;
  if (column) return cause.column === column;
  return true;
};

/**
 * 23514 - Check constraint violation
 */
export const isDatabaseCheckError = (
  error: unknown,
  constraint?: string,
): boolean => {
  const cause = getPgErrorCause(error);
  if (!cause || cause.code !== "23514") return false;
  if (constraint) return cause.constraint === constraint;
  return true;
};
