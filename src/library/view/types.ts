import { ModuleDefinition, State } from "../types/index.ts";
import * as React from "react";

export type ViewActions<M extends ModuleDefinition> = {
  validate<T>(ƒ: (model: M["Model"]) => T,state: State): boolean;
  dispatch(event: M["Actions"]): void;
  // navigate(route: M["Routes"]): void;
};

export type ViewArgs<M extends ModuleDefinition> = {
  model: M["Model"];
  actions: ViewActions<M>;
};

export type ViewDefinition<M extends ModuleDefinition> = (actions: ViewArgs<M>) => React.ReactNode;
