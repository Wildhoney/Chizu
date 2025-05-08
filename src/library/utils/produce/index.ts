import { Models } from "../../module/renderer/model/utils.ts";
import { Process } from "../../module/renderer/process/types.ts";
import { ModuleDefinition } from "../../types/index.ts";
import { State, config } from "./utils.ts";
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
 * @returns {Models<M>} A `Models` instance containing the updated model and its draft.
 */
export function update<M extends ModuleDefinition["Model"]>(
  model: M,
  process: Process,
  ƒ: (model: M) => void,
): Models<M> {
  const [, patches] = config.immer.produceWithPatches(model, ƒ);
  const values = patches.map((patch): Patch => {
    const state = patch.value instanceof State;
    return state ? { ...patch, value: patch.value.value } : patch;
  });

  const draft = config.immer.applyPatches(model, values);

  patches.forEach((patch): void => {
    const values = {
      current: get(model, patch.path) as unknown,
      updated: get(draft, patch.path) as unknown,
    };

    const object =
      typeof values.current === "object" || typeof values.updated === "object";
    const path = object ? patch.path : patch.path.slice(0, -1);
    const state = get(draft, [...path, config.states]) ?? [];

    if (!(patch.value instanceof State)) {
      const state = get(model, [...path, config.states]) ?? [];

      return void Object.defineProperty(get(draft, path), config.states, {
        value: [...state, patch.value],
        enumerable: true,
        writable: true,
        configurable: false,
      });
    }

    patch.value.process = process;

    return void Object.defineProperty(get(draft, path), config.states, {
      value: [...state, patch.value],
      enumerable: true,
      writable: true,
      configurable: false,
    });
  });

  return new Models<M>(config.immer.applyPatches(model, values), draft);
}

/**
 * Cleans up the model by removing states associated with a specific process.
 *
 * @template M - The type of the model, extending `ModuleDefinition["Model"]`.
 * @param models - The `Models` instance containing the model and its draft.
 * @param process - The process whose associated states should be removed.
 * @returns {Models<M>} The updated `Models` instance with the states cleaned up.
 */
export function cleanup<M extends ModuleDefinition["Model"]>(
  models: Models<M>,
  process: Process,
): Models<M> {
  function cleanup(model: M): void {
    if (model && typeof model === "object") {
      const states: undefined | State<M>[] = Reflect.get(model, config.states);

      if (states)
        Reflect.set(
          model,
          config.states,
          states.filter((state) => state.process !== process),
        );

      for (const key in model)
        if (Object.prototype.hasOwnProperty.call(model, key)) {
          cleanup(Reflect.get(model, key));
        }
    }
  }

  return cleanup(models.stateful), models;
}
