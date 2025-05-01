import { ModuleDefinition } from "../../types/index.ts";
import Maybe from "../maybe/index.ts";
import clone from "rfdc";

export type MaybeObject = { __kind: "Maybe" };

export type Producible<T> = {
  [K in keyof T]: T[K] extends Maybe<infer U>
    ? U extends object
      ? U & MaybeObject
      : T[K]
    : T[K];
};

export default function produce<M extends ModuleDefinition["Model"]>(
  model: M,
): [Producible<M>, Producible<M>] {
  function next(model: Producible<M>): Producible<M> {
    return new Proxy(model, {
      get(target, prop) {
        const value = Reflect.get(target, prop) as Producible<M>;
        if (typeof prop === "symbol") return value;
        if (value === undefined) Reflect.set(target, prop, {});
        return next(Reflect.get(target, prop) as Producible<M>);
      },

      set(target, prop, value) {
        Reflect.set(target, prop, value);
        return true;
      },
    });
  }

  // const cloned = clone({ proto: true })(model) as Producible<M>;
  // console.log(model, cloned);
  const proxy = next(model);
  return [model, proxy];
}
