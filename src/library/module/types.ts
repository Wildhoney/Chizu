import { ControllerDefinition } from "../controller/types.ts";
import { Module } from "../types/index.ts";
import { ViewDefinition } from "../view/types.ts";

export type ElementName = string;

export type Options<M extends Module> = {
  model: M["Model"];
  view: ViewDefinition<M>;
  controller: ControllerDefinition<M>;
};
