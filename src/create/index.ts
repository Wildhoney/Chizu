import { Actions, ControllerDefinition, Model, ViewDefinition } from "../types";

export function model<M extends Model>(model: M): M {
  return model;
}

export function controller<M extends Model, A extends Actions>(
  name: TemplateStringsArray,
) {
  return (model: M, definition: ControllerDefinition<A>) => {};
}

export function view<M extends Model, A extends Actions>(
  name: TemplateStringsArray,
) {
  return (model: M, definition: ViewDefinition<M, A>) => {};
}
