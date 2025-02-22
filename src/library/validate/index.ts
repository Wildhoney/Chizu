import { Mutations } from "../renderer/mutations/types.ts";
import { Module, State } from "../types/index.ts";
import { Validation } from "../view/types.ts";

export default function validate<M extends Module>(model: M["Model"], mutations: Mutations): Validation<M["Model"]> {
  const paths = new Set<string>();

  const handler = {
    get(record: M["Model"], key: symbol | string) {
      const value = Reflect.get(record, key);

      if (typeof key === "symbol") {
        return value;
      }

      paths.add(key);

      if (typeof value === "object" && value !== null) {
        return new Proxy(value, handler);
      }

      const path = Array.from(paths).join(".");
      const relevant = Object.values(mutations)
        .flat()
        .filter((state) => path.startsWith(state.path.join(".")));
      const states = new Set(relevant.map(({ state }) => state));

      return [...states].reduce((current, state) => current ^ state, State.Value);
    },
  };

  return new Proxy(model, handler);
}
