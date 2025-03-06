import { Mutations } from "../../module/renderer/mutations/types.ts";
import {
  ModuleDefinition,
  Operation,
  State,
  Target,
} from "../../types/index.ts";
import { Validator } from "../../view/types.ts";

const helpers = ["is", "any"] as const;

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

      const isPrimitive =
        typeof value !== "object" || value === null || Array.isArray(value);
      const object = isPrimitive ? { value } : value;

      if (helpers.includes(key as (typeof helpers)[number])) {
        if (value != null) {
          return new Proxy(object, handler);
        }

        const path = Array.from(paths).join(".");

        const directs = Object.values(mutations)
          .flat()
          .filter((state) => path === state.path);

        const indirects = Object.values(mutations)
          .flat()
          .filter(
            (state) => state.path.startsWith(path) && state.path !== path,
          );

        const directStates = [
          ...new Set(directs.map(({ state }) => state)),
        ].reduce(
          (current, state) => current | state | Target.Direct,
          State.Actual,
        );

        const indirectStates = [
          ...new Set(indirects.map(({ state }) => state)),
        ].reduce(
          (current, state) => current | state | Target.Indirect,
          State.Actual,
        );

        paths.clear();

        switch (key as (typeof helpers)[number]) {
          case "is":
            return (state: State | Operation | Target) => {
              if (!(state & (Target.Indirect | Target.Direct))) {
                state |= Target.Direct;
              }

              if (state & Target.Direct) {
                return (state & directStates) === state;
              }

              if (state & Target.Indirect) {
                return (state & indirectStates) === state;
              }
            };

          case "any":
            return (state: State | Operation | Target) => {
              return Boolean(state & directStates || state & indirectStates);
            };
        }
      }

      paths.add(key as string);
      return new Proxy(object, handler);
    },
  };

  return new Proxy(model, handler) as Validator<M["Model"]>;
}
