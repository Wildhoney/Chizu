import { ControllerDefinition } from "../controller/types.ts";
import { ModuleDefinition } from "../types/index.ts";
import { ViewArgs } from "../view/types.ts";

export type UseOptions<M extends ModuleDefinition> = {
  using: {
    model: M["Model"];
    actions: ControllerDefinition<M>;
    props?: M["Props"];
  };
  children(module: ViewArgs<M>): React.ReactNode;
};
