import { ModuleDefinition } from "../../../types/index.ts";
import { UseOptions } from "../../types.ts";
import { UseDispatchers } from "../dispatchers/types.ts";
import { UseElements } from "../elements/types.ts";
import { UseUpdate } from "../update/types.ts";
import useLifecycles from "./index.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
  elements: UseElements;
  dispatchers: UseDispatchers;
  update: UseUpdate;
};

export type UseLifecycles = ReturnType<typeof useLifecycles>;
