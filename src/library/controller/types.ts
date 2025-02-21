import { Maybe } from "../functor/maybe/index.ts";
import { Head } from "../renderer/types.ts";
import { Lifecycle, Module } from "../types/index.ts";

export type ControllerActions<M extends Module> = {
  io<T>(ƒ: () => T): T;
  produce(ƒ: (draft: M["Model"]) => void): (model: M["Model"]) => M["Model"];
  dispatch(event: M["Actions"]): void;
  // navigate(route: M["Routes"]): void;
};

export type ControllerArgs<S extends Module> = {
  model: S["Model"];
  actions: ControllerActions<S>;
};

export type ControllerDefinition<M extends Module> = (controller: ControllerArgs<M>) => ControllerInstance<M>;

export type ControllerInstance<M extends Module, T extends Maybe<never> = Maybe<never>> = {
  [Lifecycle.Mount]?(parameters: M["Routes"]): Generator<never, (model: M["Model"]) => M["Model"], T>;
  [Lifecycle.Derive]?(attributes: M["Attributes"]): Generator<never, (model: M["Model"]) => M["Model"], T>;
  [Lifecycle.Tree]?(): Generator<never, (model: M["Model"]) => M["Model"], T>;
  [Lifecycle.Unmount]?(): Generator<never, (model: M["Model"]) => M["Model"], T>;
} & Partial<Handlers<M, T>>;

type Handlers<M extends Module, T extends Maybe<never>> = {
  [K in Head<M["Actions"]>]: (payload: Payload<M, K>) => Generator<any, (model: M["Model"]) => M["Model"], T>;
};

type Payload<M extends Module, K> = M["Actions"] extends [K, infer P] ? P : never;
