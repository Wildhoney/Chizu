import { Model, ModuleDefinition } from "../types/index.ts";
import * as React from "react";

type Helpers = {
  pending(): boolean;
  optimistic(): boolean;
  failed(): boolean;
};

export type Validator<M extends Model> = M extends object
  ? {
      [K in keyof M]: M[K] extends object ? Validator<M[K]> & Helpers : Helpers;
    }
  : Helpers;

export type ViewActions<M extends ModuleDefinition> = {
  validate(ƒ: (model: Validator<M["Model"]>) => boolean): boolean;
  dispatch(event: M["Actions"]): void;
  // navigate(route: M["Routes"]): void;
};

export type ViewArgs<M extends ModuleDefinition> = {
  model: M["Model"];
  actions: ViewActions<M>;
};

export type ViewDefinition<M extends ModuleDefinition> = (actions: ViewArgs<M>) => React.ReactNode;
