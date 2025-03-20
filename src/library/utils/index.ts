import { Pk } from "../types/index.ts";

export { default as sleep } from "./sleep/index.ts";
export { default as maybe } from "./maybe/index.ts";

export function pk(): Symbol {
  return Symbol(`pk.${Date.now()}.${crypto.randomUUID()}`);
}

export function isPk<T>(id: Pk<T>): id is T {
  return Boolean(id && typeof id !== "symbol");
}
