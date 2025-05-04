import { ModuleDefinition } from "../../types/index.ts";
import { ProduceArgs } from "./types.ts";
import { State, config } from "./utils.ts";
import { Patch } from "immer";
import get from "lodash/get";

/**
 * @function patches
 * @param model {ModuleDefinition["Model"]}
 * @param ƒ {(model: ModuleDefinition["Model"]) => void}
 * @returns {Patch[]}
 */
export function patches<M extends ModuleDefinition["Model"]>(
  model: M,
  ƒ: (model: M) => void,
): Patch[] {
  const [, patches] = config.immer.produceWithPatches(model, ƒ);
  return patches;
}

/**
 * @function produce
 * @param param0 {model, process, enumerable}
 * @param ƒ {(model: M) => void}
 * @returns {M}
 */
export function states<M extends ModuleDefinition["Model"]>({
  model,
  process,
  patches,
  enumerable,
}: ProduceArgs<M>): M {
  const updated = config.immer.applyPatches(
    model,
    patches.map((patch): Patch => {
      const state = patch.value instanceof State;
      return state ? { ...patch, value: patch.value.value } : patch;
    }),
  );

  patches.forEach((patch): void => {
    if (patch.value instanceof State) {
      const value = get(updated, patch.path) as unknown;
      const object = typeof value === "object";
      const path = object ? patch.path : patch.path.slice(0, -1);
      const state = get(updated, [...path, config.states]) ?? [];

      patch.value.process = process;

      return void Object.defineProperty(get(updated, path), config.states, {
        value: [...state, patch.value],
        enumerable,
        writable: false,
        configurable: false,
      });
    }
  });

  return updated;
}
