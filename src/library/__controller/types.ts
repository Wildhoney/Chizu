import { TypedError } from "../errors/utils.ts";
import { Models } from "../module/renderer/model/utils.ts";
import { Head } from "../module/renderer/types.ts";
import {
  Actions,
  Context,
  ContextTypes,
  Draft,
  Lifecycle,
  Meta,
  ModuleDefinition,
  Op,
} from "../types/index.ts";

export type ControllerActions<M extends ModuleDefinition> = {
  annotate<T>(value: T, operations?: (Op | Draft<T>)[]): T;
  produce(
    ƒ: (model: M["Model"], meta: Meta) => void,
  ): (models: Models<M["Model"]>, process: symbol) => Models<M["Model"]>;
  dispatch(action: M["Actions"]): Promise<void>;
  context<C extends Context>(context: C): ContextTypes<C>;
};

export type ControllerArgs<M extends ModuleDefinition> = Readonly<{
  model: Readonly<M["Model"]>;
  props: Readonly<M["Props"]>;
  actions: Readonly<ControllerActions<M>>;
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
  | void
  | Promise<void>
  | ((models: Models<M["Model"]>, process: symbol) => Models<M["Model"]>)
  | Promise<(models: Models<M["Model"]>, process: symbol) => Models<M["Model"]>>
  | AsyncGenerator<
      (models: Models<M["Model"]>, process: symbol) => Models<M["Model"]>,
      (models: Models<M["Model"]>, process: symbol) => Models<M["Model"]>,
      unknown
    >;

export type ControllerDefinition<M extends ModuleDefinition> = (
  controller: ControllerArgs<M>,
) => ControllerInstance<M>;

export type ControllerInstance<M extends ModuleDefinition> = {
  [Lifecycle.Mount]?(): ActionGenerator<M>;
  [Lifecycle.Derive]?(): ActionGenerator<M>;
  [Lifecycle.Node]?(tree: HTMLElement): ActionGenerator<M>;
  [Lifecycle.Error]?(error: Error | TypedError): ActionGenerator<M>;
  [Lifecycle.Unmount]?(): ActionGenerator<M>;
} & Partial<ActionEvents<M>>;

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
