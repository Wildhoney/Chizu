import { Process } from "../../module/renderer/process/types.ts";
import { State } from "../../types/index.ts";
import {
  ArrayPlaceholder,
  BooleanPlaceholder,
  NumberPlaceholder,
  ObjectPlaceholder,
  PrimitivePlaceholder,
  StringPlaceholder,
} from "./utils.ts";

export function placeholder<T>(
  value: T,
  process: null | Process,
  state: State,
): T {
  if (Array.isArray(value))
    return new ArrayPlaceholder(process, state, ...value) as T;
  if (typeof value === "object" && value != null)
    return new ObjectPlaceholder(process, state, value) as T;
  if (typeof value === "string")
    return new StringPlaceholder(process, state, value) as T;
  if (typeof value === "number")
    return new NumberPlaceholder(process, state, value) as T;
  if (typeof value === "boolean")
    return new BooleanPlaceholder(process, state, value) as T;
  return value;
}

export function proxify<T extends object>(model: T): T {
  return new Proxy(model, {
    get(target: T, prop: string | symbol, receiver: any) {
      const value = Reflect.get(target, prop, receiver);
      const isObject = typeof value === "object" && value != null;
      return isObject ? proxify(value) : value;
    },
    set(target: T, prop: string | symbol, value: unknown): boolean {
      const current = target[prop as keyof T];

      if (
        current instanceof PrimitivePlaceholder ||
        current instanceof ArrayPlaceholder ||
        current instanceof ObjectPlaceholder
      ) {
        target[prop as keyof T] = current.clone(value);
      } else {
        target[prop as keyof T] = value as T[keyof T];
      }
      return true;
    },
  });
}
