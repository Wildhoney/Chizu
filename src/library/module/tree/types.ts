import { ControllerArgs, ControllerInstance } from "../../controller/types.ts";
import { Actions, Data, Model, Parameters, Routes } from "../../types/index.ts";
import { ModuleOptions } from "../types.ts";
import { produceWithPatches } from "immer";
import Optimistic from "../../model/state/index.ts";
import { Dispatch } from "preact/hooks";
import EventEmitter from "eventemitter3";
import { ViewArgs } from "../../view/types.ts";

export type ElementName = string;

export type Props<M extends Model, A extends Actions, R extends Routes> = {
  moduleOptions: ModuleOptions<M, A, R> & {
    elementName: ElementName;
  };
};

export type Update = Dispatch<void>;

export type Record<M extends Model, A extends Actions, R extends Routes> = {
  controller: ControllerInstance<A, Parameters>;
  state: State<M, A, R>;
};

export type Dispatchers<A extends Actions> = {
  app: EventEmitter<A[0], Data>;
  module: EventEmitter<A[0], Data>;
};

export type State<M extends Model, A extends Actions, R extends Routes> = {
  controller: ControllerArgs<M, A, R>;
  view: ViewArgs<M, A, R>;
};

type ProduceWithPatches = ReturnType<typeof produceWithPatches>;

export type ControllerGeneratorAction<_M extends Model> =
  | undefined
  | Generator<
      () => Promise<any> | Optimistic<any>,
      ProduceWithPatches,
      [string, string]
    >;
