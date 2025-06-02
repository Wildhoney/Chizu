import { ModuleDefinition } from "../types/index.ts";
import { Props } from "./types.ts";

/**
 *  Check if the error is an instance of TypedError.
 *
 * @param error {Error | TypedError}
 * @returns {boolean}
 */
export function isTypedError(error: Error | TypedError): error is TypedError {
  return error instanceof TypedError;
}

/**
 * Convert an unknown error into a known error type.
 *
 * @function intoError
 * @param error {unknown} - The error to convert to a known error type.
 * @returns {Error | TypedError}
 */
export function intoError(error: unknown): Error | TypedError {
  if (error instanceof TypedError || error instanceof Error) {
    return error;
  }

  return new Error("Unknown error", { cause: error });
}

/**
 * @class TypedError
 * @extends Error
 * @param type {string} - The type of the error.
 * @param message {string} - The error message.
 */
export class TypedError extends Error {
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
