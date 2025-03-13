import { ModuleDefinition } from "../types/index.ts";
import * as React from "react";

export type ViewActions<M extends ModuleDefinition> = {
  dispatch(event: M["Actions"]): void;
};

export type ViewArgs<M extends ModuleDefinition> = {
  model: M["Model"];
  actions: ViewActions<M>;
};

export type ViewDefinition<M extends ModuleDefinition> = (
  actions: ViewArgs<M>,
) => React.ReactNode;
