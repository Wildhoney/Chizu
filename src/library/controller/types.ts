import { Head } from "../module/renderer/types.ts";
import {
  Actions,
  Events,
  Lifecycle,
  ModuleDefinition,
  State,
} from "../types/index.ts";

export type Produce<M extends ModuleDefinition> =
  | void
  | ((model: M["Model"]) => M["Model"]);

export type ControllerActions<M extends ModuleDefinition> = {
  io<T>(ƒ: () => T): T;
  placeholder<T>(value: T, state: State): T;
  produce(ƒ: (draft: M["Model"]) => void): void;
  dispatch(event: M["Actions"]): void;
};

export type ControllerArgs<M extends ModuleDefinition> = {
  model: M["Model"];
  events: Events<M["Attributes"]>;
  actions: ControllerActions<M>;
};

export type ActionGenerator<M extends ModuleDefinition> = Generator<
  unknown,
  (model: M["Model"]) => M["Model"],
  void
>;

export type ControllerDefinition<M extends ModuleDefinition> = (
  controller: ControllerArgs<M>,
) => ControllerInstance<M>;

export type ControllerInstance<M extends ModuleDefinition> = {
  [Lifecycle.Mount]?(parameters: M["Routes"]): ActionGenerator<M>;
  [Lifecycle.Derive]?(attributes: M["Attributes"]): ActionGenerator<M>;
  [Lifecycle.Tree]?(): ActionGenerator<M>;
  [Lifecycle.Unmount]?(): ActionGenerator<M>;
} & Partial<Handlers<M>>;

type Handlers<M extends ModuleDefinition> = {
  [K in Head<M["Actions"]>]: (
    payload: Payload<M["Actions"], K>,
  ) => ActionGenerator<M>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
