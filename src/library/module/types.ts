import {
  Actions,
  ControllerDefinition,
  Model,
  ViewDefinition,
} from "../types/index.ts";

export type ModuleOptions<M extends Model, A extends Actions> = {
  model: M;
  view: ViewDefinition<M, A>;
  controller: ControllerDefinition<M, A>;
};
