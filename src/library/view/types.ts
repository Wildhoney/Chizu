import { Model, ModuleDefinition, State } from "../types/index.ts";
import * as React from "react";

export type Validation<M extends Model> = {
  [K in keyof M]: M[K] extends Model ? Validation<M[K]> : State;
};

export type ViewActions<M extends ModuleDefinition> = {
  validate<T>(ƒ: (model: Validation<M["Model"]>) => T): T;
  dispatch(event: M["Actions"]): void;
  // navigate(route: M["Routes"]): void;
};

export type ViewArgs<M extends ModuleDefinition> = {
  model: M["Model"];
  actions: ViewActions<M>;
};

export type ViewDefinition<M extends ModuleDefinition> = (actions: ViewArgs<M>) => React.ReactNode;
