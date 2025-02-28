import { Mutations } from "../../module/renderer/mutations/types.ts";
import { ModuleDefinition, State } from "../../types/index.ts";
import { Validator } from "../../view/types.ts";

const helpers = ["pending", "optimistic", "failed"] as const;

export default function validate<M extends ModuleDefinition>(
  model: M["Model"],
  mutations: Mutations,
): Validator<M["Model"]> {
  const paths = new Set<string>();

  const handler = {
    get(record: M["Model"], key: symbol | string) {
      const value = Reflect.get(record, key);

      if (typeof key === "symbol") {
        return value;
      }

      const isPrimitive = typeof value !== "object" || value === null || Array.isArray(value);
      const object = isPrimitive ? { value } : value;

      if (helpers.includes(key as (typeof helpers)[number])) {
        if (value != null) {
          return new Proxy(object, handler);
        }

        const path = Array.from(paths).join(".");
        const relevant = Object.values(mutations)
          .flat()
          .filter((state) => path === state.path.join("."));

        const state = [...new Set(relevant.map(({ state }) => state))].reduce((current, state) => current ^ state, 0);

        paths.clear();

        switch (key as (typeof helpers)[number]) {
          case "pending":
            return () => Boolean(state & State.Pending);

          case "optimistic":
            return () => Boolean(state & State.Optimistic);

          case "failed":
            return () => Boolean(state & State.Failed);
        }
      }

      paths.add(key as string);
      return new Proxy(object, handler);
    },
  };

  return new Proxy(model, handler) as Validator<M["Model"]>;
}
