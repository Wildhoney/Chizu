import { Process } from "../../module/renderer/process/types.ts";
import { ModuleDefinition } from "../../types/index.ts";
import { Models, State, config } from "./utils.ts";
import { Patch } from "immer";
import get from "lodash/get";

/**
 * Produces a new model by applying a series of patches to the given model.
 * This function uses Immer to handle immutable updates and applies additional
 * processing for `State` instances within the patches.
 *
 * @template M - The type of the model, extending `ModuleDefinition["Model"]`.
 * @param model - The initial model to be updated.
 * @param process - The process associated with the `State` instances, or `null` if no process is provided.
 * @param ƒ - A function that mutates the model draft to produce the desired changes.
 * @returns A `Models` instance containing the updated model and its draft.
 */
export function produce<M extends ModuleDefinition["Model"]>(
  model: M,
  process: null | Process,
  ƒ: (model: M) => void,
): Models<M> {
  const [, patches] = config.immer.produceWithPatches(model, ƒ);
  const values = patches.map((patch): Patch => {
    const state = patch.value instanceof State;
    return state ? { ...patch, value: patch.value.value } : patch;
  });

  const draft = config.immer.applyPatches(model, values);

  patches.forEach((patch): void => {
    if (patch.value instanceof State) {
      const value = get(draft, patch.path) as unknown;
      const object = typeof value === "object";
      const path = object ? patch.path : patch.path.slice(0, -1);
      const state = get(draft, [...path, config.states]) ?? [];

      patch.value.process = process;

      return void Object.defineProperty(get(draft, path), config.states, {
        value: [...state, patch.value],
        enumerable: true,
        writable: false,
        configurable: false,
      });
    }
  });

  return new Models<M>(config.immer.applyPatches(model, values), draft);
}
