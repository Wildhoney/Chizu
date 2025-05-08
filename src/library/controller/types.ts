import { EventError } from "../module/renderer/dispatchers/utils.ts";
import { Head } from "../module/renderer/types.ts";
import {
  Actions,
  Events,
  Lifecycle,
  ModuleDefinition,
  Operation,
  Queue,
  Values,
} from "../types/index.ts";

export type ControllerActions<M extends ModuleDefinition> = {
  state<T>(value: T, operation: null | Operation): T;
  produce(ƒ: (draft: M["Model"]) => void): void;
  dispatch(event: M["Actions"]): Promise<void>;
};

export type ControllerArgs<M extends ModuleDefinition> = Readonly<{
  model: Readonly<M["Model"]>;
  queue: Readonly<Queue<M["Actions"]>>;
  events: Readonly<Events<M["Props"]>>;
  actions: Readonly<ControllerActions<M>>;
}>;

export type ActionGenerator = AsyncGenerator<
  void | Promise<void>,
  void | Promise<void>,
  void | Promise<void>
>;

export type ControllerDefinition<M extends ModuleDefinition> = (
  controller: ControllerArgs<M>,
) => ControllerInstance<M>;

export type ControllerInstance<M extends ModuleDefinition> = {
  [Lifecycle.Mount]?(): ActionGenerator;
  [Lifecycle.Derive]?(props: Values<M["Props"]>): ActionGenerator;
  [Lifecycle.Tree]?(tree: HTMLElement): ActionGenerator;
  [Lifecycle.Error]?(error: Error | EventError): ActionGenerator;
  [Lifecycle.Unmount]?(): ActionGenerator;
} & Partial<Handlers<M>>;

type Handlers<M extends ModuleDefinition> = {
  [K in Head<M["Actions"]>]: (
    payload: Payload<M["Actions"], K>,
  ) => ActionGenerator;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
