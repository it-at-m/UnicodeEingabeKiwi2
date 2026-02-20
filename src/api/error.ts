export enum Levels {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export interface KiwiErrorOptions {
  message: string;
  level?: Levels;
  cause?: Error;
}

export class KiwiError extends Error {
  level: Levels;
  cause?: Error;

  constructor(options: KiwiErrorOptions) {
    super(options.message);
    this.name = "KiwiError";
    this.level = options.level || Levels.ERROR;
    this.cause = options.cause;
  }
}

export type ShowMessageFn = (payload: {
  message: string;
  level: Levels;
  timeout?: number;
}) => void;

export function handleThreadError(
  error: unknown,
  showMessage?: ShowMessageFn
): void {
  console.debug("Error:", error);

  const message =
    error instanceof KiwiError
      ? error.message
      : "An unexpected error occurred. Please try again later.";

  const level = error instanceof KiwiError ? error.level : Levels.ERROR;

  if (showMessage) {
    showMessage({ message, level, timeout: 3000 });
  }
}
