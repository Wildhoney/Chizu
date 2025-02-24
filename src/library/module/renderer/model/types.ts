import useModel from ".";
import { ModuleDefinition } from "../../../types/index.ts";
import { UseOptions } from "../types.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
};

export type UseModel = ReturnType<typeof useModel>;
