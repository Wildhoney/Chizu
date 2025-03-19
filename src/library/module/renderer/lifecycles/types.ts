import { ModuleDefinition } from "../../../types/index.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UseOptions } from "../types.ts";
import useElements from "./index.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
  dispatchers: UseDispatchers;
};

export type UseElements = ReturnType<typeof useElements>;
