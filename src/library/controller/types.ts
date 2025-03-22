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

export type ActionGenerator = Generator<void | Promise<void>, void, void>;

export type ControllerDefinition<M extends ModuleDefinition> = (
  controller: ControllerArgs<M>,
) => ControllerInstance<M>;

export type ControllerInstance<M extends ModuleDefinition> = {
  [Lifecycle.Mount]?(parameters: M["Routes"]): ActionGenerator;
  [Lifecycle.Derive]?(attributes: M["Attributes"]): ActionGenerator;
  [Lifecycle.Tree]?(): ActionGenerator;
  [Lifecycle.Unmount]?(): ActionGenerator;
} & Partial<Handlers<M>>;

type Handlers<M extends ModuleDefinition> = {
  [K in Head<M["Actions"]>]: (
    payload: Payload<M["Actions"], K>,
  ) => ActionGenerator;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
