import { Validatable } from "../module/renderer/model/types.ts";
import { Events, ModuleDefinition } from "../types/index.ts";
import * as React from "react";

export type ViewActions<M extends ModuleDefinition> = {
  dispatch(event: M["Actions"]): Promise<void>;
};

export type ViewArgs<M extends ModuleDefinition> = Readonly<{
  model: Readonly<Validatable<M["Model"]>>;
  events: Readonly<Events<M["Props"]>>;
  actions: Readonly<ViewActions<M>>;
}>;

export type ViewDefinition<M extends ModuleDefinition> = (
  actions: ViewArgs<M>,
) => React.ReactNode;
