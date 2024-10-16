import { ControllerDefinition } from "../controller/types.ts";
import { Actions, Model } from "../types/index.ts";
import { ViewDefinition } from "../view/types.ts";

export type ModuleOptions<M extends Model, A extends Actions> = {
  model: M;
  view: ViewDefinition<M, A>;
  controller: ControllerDefinition<M, A>;
};
