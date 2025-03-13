import { Model, ModuleDefinition, State } from "../types/index.ts";
import * as React from "react";


type Helpers = {
  is(state: State): boolean;
};

export type Validator<M extends Model> = M extends object
  ? {
      [K in keyof M]: M[K] extends object ? Validator<M[K]> & Helpers : Helpers;
    }
  : Helpers;


export type ViewActions<M extends ModuleDefinition> = {
  dispatch(event: M["Actions"]): void;
};

export type ViewArgs<M extends ModuleDefinition> = {
  model: M["Model"];
  validate: Validator<M["Model"]>;
  actions: ViewActions<M>;
};

export type ViewDefinition<M extends ModuleDefinition> = (
  actions: ViewArgs<M>,
) => React.ReactNode;
