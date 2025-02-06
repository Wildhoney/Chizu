import { ControllerDefinition } from "../controller/types.ts";
import { Stitched } from "../types/index.ts";
import { ViewDefinition } from "../view/types.ts";

export type ModuleOptions<S extends Stitched> = {
  model: S["Model"];
  view: ViewDefinition<S>;
  controller: ControllerDefinition<S>;
};
