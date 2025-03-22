import { Mutations } from "../../module/renderer/mutations/types.ts";
import { Process } from "../../module/renderer/process/types.ts";
import { ModuleDefinition, State } from "../../types/index.ts";
import { Validator } from "../../view/types.ts";
import { Placeholder, unwrap } from "./utils.ts";

/**
 * Create a placeholder for a value that is being processed.
 *
 * @param value {T}
 * @param state {State}
 * @param process {null | Process}
 * @returns {T}
 */
export function placeholder<T>(
  value: T,
  state: State,
  process: null | Process,
): T {
  return new Placeholder(value, state, process) as T;
}

/**
 * Observe a model for changes and track mutations to determine the state of a mutation.
 *
 * @param model {M}
 * @param mutations {Mutations}
 * @returns {M}
 */
export function observe<M extends ModuleDefinition["Model"]>(
  model: M,
  mutations: Mutations,
): M {
  return new Proxy(model, {
    get(target, key) {
      const value = Reflect.get(target, key) as M | Placeholder<M>;
      const placeholder = value instanceof Placeholder;
      const unwrapped = placeholder ? value.value() : value;
      const process = placeholder ? value.process() : null;
      const type = Array.isArray(target) ? "array" : "object";

      if (key === unwrap) return target;

      if (placeholder && process) {
        mutations.add({
          key: type === "array" ? null : key,
          value: target,
          type,
          process,
          state: value.state(),
        });
      }

      return typeof unwrapped === "object"
        ? observe(unwrapped as object, mutations)
        : unwrapped;
    },
    set(target, key, value) {
      const isPlaceholder = value instanceof Placeholder;
      const placeholder = value;
      const process = isPlaceholder ? placeholder.process() : null;
      const resolved = isPlaceholder ? placeholder.value() : value;
      const unwrapped =
        resolved == null ? null : (resolved[unwrap] ?? resolved);
      const type = Array.isArray(unwrapped) ? "array" : "object";

      if (isPlaceholder && process) {
        mutations.add({
          key: type === "array" ? null : key,
          value: Array.isArray(target) ? unwrapped : target,
          type,
          process,
          state: placeholder.state(),
        });
      }
      return Reflect.set(target, key, unwrapped);
    },
  });
}

/**
 * Validate a model against mutations to determine the state of a mutation and provide
 * immediate feedback in the form of optimistic updates.
 *
 * @param model {M}
 * @param mutations {Mutations}
 * @returns {Validator<M>}
 */
export function validate<M extends ModuleDefinition["Model"]>(
  model: M,
  mutations: Mutations,
): Validator<M> {
  function validator(target: M, key: string = ""): M {
    return new Proxy(target, {
      get(target, prop) {
        const value = Reflect.get(target, prop);

        if (typeof prop === "symbol") return value;

        if (prop === "is") {
          const applicableMutations = [...mutations].filter((mutation) => {
            return (
              mutation.value === target &&
              (mutation.type === "array"
                ? true
                : /^\d+$/.test(String(mutation.key))
                  ? true
                  : mutation.key === key)
            );
          });

          return (state: State) => {
            if (applicableMutations.length === 0) return false;

            const states = new Set(
              applicableMutations.map((mutation) => mutation.state),
            );
            const current = [...states].reduce(
              (current, state) => current | state,
              State.Pending,
            );

            return Boolean(current & state);
          };
        }

        if (typeof value === "object" && value !== null)
          return validator(value, prop);

        return validator(target, prop);
      },
    });
  }

  return validator(model);
}
