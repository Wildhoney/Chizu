import { ModuleDefinition } from "../../../types/index.ts";
import { UseOptions } from "../types.ts";
import { UseUpdate } from "../update/types.ts";
import useProps from "./index.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
  update: UseUpdate;
};

export type UseProps = ReturnType<typeof useProps>;
