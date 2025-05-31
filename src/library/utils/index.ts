import { Pk } from "../types/index.ts";

export { default as sleep } from "./sleep/index.ts";

export function pk(): symbol;
export function pk<T>(id: Pk<T>): boolean;
export function pk<T>(id?: Pk<T>): boolean | symbol {
  if (id) return Boolean(id && typeof id !== "symbol");
  return Symbol(`pk.${Date.now()}.${crypto.randomUUID()}`);
}

export function hash<T>(x: T): string {
  return JSON.stringify(x);
}

export const Meta = {
  Error: Symbol("meta/error"),
};
