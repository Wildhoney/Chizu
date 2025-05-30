export function isActionError(
  error: Error | ActionError | ComponentError,
): error is ActionError {
  return error instanceof ActionError;
}

export function isComponentError(
  error: Error | ActionError | ComponentError,
): error is ComponentError {
  return error instanceof ComponentError;
}

/**
 * Convert an unknown error into a known error type.
 *
 * @function intoError
 * @param error {unknown} - The error to convert to a known error type.
 * @returns {Error | ActionError | ComponentError}
 */
export function intoError(
  error: unknown,
): Error | ActionError | ComponentError {
  if (
    error instanceof ActionError ||
    error instanceof ComponentError ||
    error instanceof Error
  ) {
    return error;
  }

  return new Error("Unknown error", { cause: error });
}

/**
 * Custom error class for action errors.
 *
 * @class ActionError
 * @extends Error
 * @param type {string} - The type of the error.
 * @param message {string} - The error message.
 */
export class ActionError extends Error {
  #type: number | string | symbol;
  #message: null | string;

  constructor(type: number | string | symbol, message: null | string = null) {
    super(String(message));
    this.#type = type;
    this.#message = message;
  }

  get type(): number | string | symbol {
    return this.#type;
  }

  get message(): string {
    return this.#message || "";
  }
}

/**
 * Custom error class for component errors.
 *
 * @class ComponentError
 * @extends Error
 * @param type {string} - The type of the error.
 * @param message {string} - The error message.
 */
export class ComponentError extends Error {
  #message: null | string;

  constructor(message: null | string = null) {
    super(String(message));
    this.#message = message;
  }

  get message(): string {
    return this.#message || "";
  }
}
