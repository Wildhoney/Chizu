import * as React from "react";
import { ModuleDefinition } from "../types/index.ts";
import { ViewArgs } from "../view/types.ts";
import { UseModel } from "../module/renderer/model/types.ts";
import { UseDispatchers } from "../module/renderer/dispatchers/types.ts";
import { UseUpdate } from "../module/renderer/update/types.ts";

export type Props<M extends ModuleDefinition> = {
  module: ViewArgs<M>;
  model: UseModel;
  dispatchers: UseDispatchers;
  update: UseUpdate;
  children(): React.ReactNode;
};
