import { ComponentChildren } from "preact";
import { Model, State, Stitched } from "../types/index.ts";

export type Validation<M extends Model> = {
  [K in keyof M]: M[K] extends Model ? Validation<M[K]> : State;
};

export type ViewActions<S extends Stitched> = {
  validate<T>(ƒ: (model: Validation<S["Model"]>) => T): T;
  pending<T>(ƒ: (model: Validation<S["Model"]>) => T): boolean;
  dispatch(event: S["Actions"]): void;
  navigate(route: S["Routes"]): void;
};

export type ViewArgs<S extends Stitched> = {
  model: S["Model"];
  element: null | HTMLElement;
  actions: ViewActions<S>;
};

export type ViewDefinition<S extends Stitched> = (
  actions: ViewArgs<S>,
) => ComponentChildren;
