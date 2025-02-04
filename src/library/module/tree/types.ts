import { ControllerArgs, ControllerInstance } from "../../controller/types.ts";
import {
  Actions,
  Data,
  Model,
  Parameters,
  Props,
  Routes,
  State,
} from "../../types/index.ts";
import { ModuleOptions } from "../types.ts";
import { produceWithPatches } from "immer";
import Optimistic from "../../model/state/index.ts";
import { Dispatch, MutableRef } from "preact/hooks";
import EventEmitter from "eventemitter3";
import { ViewArgs } from "../../view/types.ts";

export type ElementName = string;

export type ModuleProps<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  moduleOptions: ModuleOptions<M, A, R> & {
    elementName: ElementName;
    elementProps: Props;
  };
};

type ModuleUpdate = Dispatch<void>;

export type ModuleDispatchers<A extends Actions> = {
  app: EventEmitter<A[0], Data>;
  module: EventEmitter<A[0], Data>;
};

export type ModuleContext<M extends Model, A extends Actions> = [
  MutableRef<M>,
  ControllerInstance<A, Parameters>,
  ModuleUpdate,
  MutableRef<number>,
  MutableRef<ModuleQueue>,
  MutableRef<ModuleMutations>,
];

export type ModuleQueue = Set<Promise<void>>;

export type ModuleState<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  controller: ControllerArgs<M, A, R>;
  view: ViewArgs<M, A, R>;
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
