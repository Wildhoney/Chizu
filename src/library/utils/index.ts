import { Pk } from "../types/index.ts";

export { default as sleep } from "./sleep/index.ts";
export { default as maybe } from "./maybe/index.ts";

export function pk<T>(): Symbol;
export function pk<T>(id: Pk<T>): boolean;
export function pk<T>(id?: Pk<T>): boolean | Symbol {
  if (id) return Boolean(id && typeof id !== "symbol");
  return Symbol(`pk.${Date.now()}.${crypto.randomUUID()}`);
}
