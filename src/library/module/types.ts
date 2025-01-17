import { ControllerDefinition } from "../controller/types.ts";
import { Actions, Model, Routes } from "../types/index.ts";
import { ViewDefinition } from "../view/types.ts";

export type ModuleOptions<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  model: M;
  view: ViewDefinition<M, A, R>;
  controller: ControllerDefinition<M, A, R>;
};
