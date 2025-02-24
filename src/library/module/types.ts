import { ControllerDefinition } from "../controller/types.ts";
import { ModuleDefinition } from "../types/index.ts";
import { ViewDefinition } from "../view/types.ts";

export type ElementName = string;

export type Options<M extends ModuleDefinition> = {
  model: M["Model"];
  view: ViewDefinition<M>;
  controller: ControllerDefinition<M>;
};
