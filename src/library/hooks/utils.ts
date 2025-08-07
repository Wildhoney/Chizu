import { RefObject } from "react";

export function withGetters<T extends object>(obj: T, obj2: RefObject<T>): T {
  const result = {};
  for (const key of Object.keys(obj)) {
    Object.defineProperty(result, key, {
      get() {
        return obj2.current[key];
      },
      enumerable: true,
    });
  }

  return result;
}