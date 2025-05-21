import { EventError } from "../module/renderer/dispatchers/utils.ts";
import { Models } from "../module/renderer/model/utils.ts";
import * as Router from "../module/renderer/router/types.ts";
import { Head } from "../module/renderer/types.ts";
import {
  Actions,
  Draft,
  Lifecycle,
  ModuleDefinition,
  Op,
  Query,
  Queue,
} from "../types/index.ts";

export type ControllerActions<M extends ModuleDefinition> = {
  annotate<T>(value: T, operations?: (Op | Draft<T>)[]): T;
  produce(
    ƒ: (model: M["Model"]) => void,
  ): (models: Models<M["Model"]>, process: Symbol) => Models<M["Model"]>;
  dispatch(action: M["Actions"]): Promise<void>;
};

export type ControllerArgs<M extends ModuleDefinition> = Readonly<{
  model: Readonly<M["Model"]>;
  queue: Readonly<Queue<M["Actions"]>>;
  router: M["Query"] extends NonNullable<Query>
    ? Readonly<Router.Context<M["Query"]>>
    : null;
  actions: Readonly<ControllerActions<M>>;
  props: Readonly<M["Props"]>;
}>;

export type ActionEvent<M extends ModuleDefinition> = (
  ...args: M["Actions"][number]
) => ActionGenerator<M>;

type ActionEvents<M extends ModuleDefinition> = {
  [K in Head<M["Actions"]>]: (
    payload: Payload<M["Actions"], K>,
  ) => ActionGenerator<M>;
};

export type ActionGenerator<M extends ModuleDefinition> =
  | ((models: Models<M["Model"]>, process: Symbol) => Models<M["Model"]>)
  | AsyncGenerator<
      (models: Models<M["Model"]>, process: Symbol) => Models<M["Model"]>,
      (models: Models<M["Model"]>, process: Symbol) => Models<M["Model"]>,
      unknown
    >;

export type ControllerDefinition<M extends ModuleDefinition> = (
  controller: ControllerArgs<M>,
) => ControllerInstance<M>;

export type ControllerInstance<M extends ModuleDefinition> = {
  [Lifecycle.Mount]?(): ActionGenerator<M>;
  [Lifecycle.Derive]?(): ActionGenerator<M>;
  [Lifecycle.Node]?(tree: HTMLElement): ActionGenerator<M>;
  [Lifecycle.Error]?(error: Error | EventError): ActionGenerator<M>;
  [Lifecycle.Unmount]?(): ActionGenerator<M>;
} & Partial<ActionEvents<M>>;

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
