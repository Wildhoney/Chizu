import { ControllerArgs, ControllerInstance } from "../../controller/types.ts";
import { Data, Model, Module, State } from "../../types/index.ts";
import { Options } from "../types.ts";
import { produceWithPatches } from "immer";
import Optimistic from "../../model/state/index.ts";
import EventEmitter from "eventemitter3";
import { ViewArgs } from "../../view/types.ts";

import * as React from "react";

export type ElementName = string;

export type TreeProps<M extends Module> = {
  name: ElementName;
  attributes: M["Props"];
  options: Options<M>;
};

type ModuleUpdate = React.Dispatch<void>;

export type ModuleDispatchers<_S extends Stitched> = {
  app: EventEmitter<string, Data>;
  module: EventEmitter<string, Data>;
};

export type ModuleContext<S extends Stitched> = [
  ElementName,
  React.RefObject<S["Model"]>,
  ControllerInstance<S>,
  ModuleUpdate,
  React.RefObject<number>,
  React.RefObject<ModuleQueue>,
  React.RefObject<ModuleMutations>,
  React.RefObject<null | HTMLElement>,
];

export type ModuleQueue = Set<Promise<void>>;

export type ModuleState<S extends Stitched> = {
  controller: ControllerArgs<S>;
  view: ViewArgs<S>;
};

export type ModuleMutations = Record<
  string,
  {
    name: string;
    mutations: [{ path: string; state: State[] }];
  }
>;

type ProduceWithPatches = ReturnType<typeof produceWithPatches>;

export type ControllerGeneratorAction<_M extends Model> =
  | undefined
  | Generator<
      () => Promise<any> | Optimistic<any>,
      ProduceWithPatches,
      [string, string]
    >;
