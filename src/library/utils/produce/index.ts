import { Process } from "../../module/renderer/process/types.ts";
import { ModuleDefinition } from "../../types/index.ts";
import { State, states } from "./utils.ts";
import { Immer, Patch, applyPatches, enablePatches } from "immer";
import get from "lodash/get";

const immer = new Immer();
immer.setAutoFreeze(false);
enablePatches();

export function produce<M extends ModuleDefinition["Model"]>(
  model: M,
  process: null | Process,
  ƒ: (model: M) => void,
): M {
  const [, patches] = immer.produceWithPatches(model, ƒ);

  return applyPatches(
    model,
    patches.flatMap((patch): Patch[] => {
      if (patch.value instanceof State) {
        patch.value.process = process;

        const op = "add" as const;
        const values = { future: patch.value, current: get(model, patch.path) };
        const object = typeof values.current === "object";
        const path = object ? patch.path : patch.path.slice(0, -1);
        // const index = (get(model, [...path, states]) ?? []).length;

        return [
          { ...patch, value: patch.value.value },
          { op, path: [...path, states], value: [patch.value] },
        ];
      }

      return [patch];
    }),
  );
}
