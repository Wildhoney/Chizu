import { ModuleDefinition } from "../../../types/index.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UseElements } from "../elements/types.ts";
import { UseOptions } from "../types.ts";
import useLifecycles from "./index.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
  elements: UseElements;
  dispatchers: UseDispatchers;
};

export type UseLifecycles = ReturnType<typeof useLifecycles>;
