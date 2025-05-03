import { EventError } from "../module/renderer/dispatchers/utils.ts";
import { Pk } from "../types/index.ts";

export { default as sleep } from "./sleep/index.ts";

export function pk<T>(): Symbol;
export function pk<T>(id: Pk<T>): boolean;
export function pk<T>(id?: Pk<T>): boolean | Symbol {
  if (id) return Boolean(id && typeof id !== "symbol");
  return Symbol(`pk.${Date.now()}.${crypto.randomUUID()}`);
}

export function isEventError(error: Error | EventError): error is EventError {
  return error instanceof EventError;
}
