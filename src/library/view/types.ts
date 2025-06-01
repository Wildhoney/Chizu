import { Validatable } from "../module/renderer/model/types.ts";
import { Channel, ModuleDefinition } from "../types/index.ts";
import * as React from "react";

export type ViewActions<M extends ModuleDefinition> = {
  dispatch(action: M["Actions"]): Promise<void>;
};

export type ViewArgs<M extends ModuleDefinition> = Readonly<{
  model: Readonly<M["Model"]>;
  channel: {
    is(channel: Channel): boolean;
  };
  validate: Readonly<Validatable<M["Model"]>>;
  actions: Readonly<ViewActions<M>>;
}>;

export type ViewDefinition<M extends ModuleDefinition> = (
  actions: ViewArgs<M>,
) => React.ReactNode;
