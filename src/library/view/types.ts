import { Model, ModuleDefinition, State } from "../types/index.ts";
import * as React from "react";

export type Validator<M extends Model> = {
  [P in keyof M]: Validator<M[P]> & {
    is(state: State): boolean;
  };
};

export type ViewActions<M extends ModuleDefinition> = {
  dispatch(event: M["Actions"]): Promise<void>;
};

export type ViewArgs<M extends ModuleDefinition> = Readonly<{
  model: M["Model"];
  validate: Validator<M["Model"]>;
  actions: ViewActions<M>;
}>;

export type ViewDefinition<M extends ModuleDefinition> = (
  actions: ViewArgs<M>,
) => React.ReactNode;
