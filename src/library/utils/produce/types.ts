import { Process } from "../../module/renderer/process/types.ts";
import { ModuleDefinition } from "../../types/index.ts";
import { Patch } from "immer";

export type ProduceArgs<M extends ModuleDefinition["Model"]> = {
  model: M;
  process: null | Process;
  patches: Patch[];
  enumerable: boolean;
};
