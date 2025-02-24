import { Head } from "../module/renderer/types.ts";
import { Lifecycle, ModuleDefinition } from "../types/index.ts";
import Maybe from "../utils/maybe/index.ts";

export type ControllerActions<M extends ModuleDefinition> = {
  io<T>(ƒ: () => T): T;
  produce(ƒ: (draft: M["Model"]) => void): (model: M["Model"]) => M["Model"];
  dispatch(event: M["Actions"]): void;
  // navigate(route: M["Routes"]): void;
};

export type ControllerArgs<S extends ModuleDefinition> = {
  model: S["Model"];
  actions: ControllerActions<S>;
};

export type ControllerDefinition<M extends ModuleDefinition> = (controller: ControllerArgs<M>) => ControllerInstance<M>;

export type ControllerInstance<M extends ModuleDefinition, T extends Maybe<never> = Maybe<never>> = {
  [Lifecycle.Mount]?(parameters: M["Routes"]): Generator<unknown, (model: M["Model"]) => M["Model"], T>;
  [Lifecycle.Derive]?(attributes: M["Attributes"]): Generator<unknown, (model: M["Model"]) => M["Model"], T>;
  [Lifecycle.Tree]?(): Generator<unknown, (model: M["Model"]) => M["Model"], T>;
  [Lifecycle.Unmount]?(): Generator<unknown, (model: M["Model"]) => M["Model"], T>;
} & Partial<Handlers<M, T>>;

type Handlers<M extends ModuleDefinition, T extends Maybe<never>> = {
  [K in Head<M["Actions"]>]: (payload: Payload<M, K>) => Generator<any, (model: M["Model"]) => M["Model"], T>;
};

type Payload<M extends ModuleDefinition, K> = M["Actions"] extends [K, infer P] ? P : never;
