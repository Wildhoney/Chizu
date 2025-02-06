import { ControllerArgs, ControllerInstance } from "../../controller/types.ts";
import { Data, Model, Props, State, Stitched } from "../../types/index.ts";
import { ModuleOptions } from "../types.ts";
import { produceWithPatches } from "immer";
import Optimistic from "../../model/state/index.ts";
import { Dispatch, MutableRef } from "preact/hooks";
import EventEmitter from "eventemitter3";
import { ViewArgs } from "../../view/types.ts";

export type ElementName = string;

export type ModuleProps<S extends Stitched> = {
  moduleOptions: ModuleOptions<S> & {
    elementName: ElementName;
    elementProps: Props;
  };
};

type ModuleUpdate = Dispatch<void>;

export type ModuleDispatchers<S extends Stitched> = {
  app: EventEmitter<S["Actions"][0], Data>;
  module: EventEmitter<S["Actions"][0], Data>;
};

export type ModuleContext<S extends Stitched> = [
  MutableRef<S["Model"]>,
  ControllerInstance<S>,
  ModuleUpdate,
  MutableRef<number>,
  MutableRef<ModuleQueue>,
  MutableRef<ModuleMutations>,
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
