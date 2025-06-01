import { ModuleDefinition } from "../types/index.ts";
import { Props } from "./types.ts";

export function isActionError(error: Error | UserError): error is UserError {
  return error instanceof UserError;
}

export function isUserError(error: Error | UserError): error is UserError {
  return error instanceof UserError;
}

/**
 * Convert an unknown error into a known error type.
 *
 * @function intoError
 * @param error {unknown} - The error to convert to a known error type.
 * @returns {Error | UserError}
 */
export function intoError(error: unknown): Error | UserError {
  if (error instanceof UserError || error instanceof Error) {
    return error;
  }

  return new Error("Unknown error", { cause: error });
}

/**
 * @class UserError
 * @extends Error
 * @param type {string} - The type of the error.
 * @param message {string} - The error message.
 */
export class UserError extends Error {
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

export function Child<M extends ModuleDefinition>({
  children,
}: Pick<Props<M>, "children">): React.ReactNode {
  return children();
}
