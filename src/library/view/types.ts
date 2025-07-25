import { Validatable } from "../module/renderer/model/types.ts";
import { Boundary, ModuleDefinition } from "../types/index.ts";
import * as React from "react";

export type ViewActions<M extends ModuleDefinition> = {
  dispatch(action: M["Actions"]): Promise<void>;
};

export type ViewArgs<M extends ModuleDefinition> = Readonly<{
  model: Readonly<M["Model"]>;
  props: Readonly<M["Props"]>;
  boundary: {
    is(boundary: Boundary): boolean;
  };
  validate: Readonly<Validatable<M["Model"]>>;
  actions: Readonly<ViewActions<M>>;
}>;

export type ViewDefinition<M extends ModuleDefinition> = (
  actions: ViewArgs<M>,
) => React.ReactNode;
