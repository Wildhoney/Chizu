import { Actions, Lifecycle, Module } from "../types/index.ts";

export type ControllerActions<M extends Module> = {
  io<T>(ƒ: () => T): () => T;
  produce(ƒ: (draft: M["Model"]) => void): void;
  dispatch(event: M["Actions"]): void;
  navigate(route: M["Routes"]): void;
};

export type ControllerArgs<S extends Module> = {
  model: S["Model"];
  actions: ControllerActions<S>;
};

export type ControllerDefinition<M extends Module> = (controller: ControllerArgs<M>) => ControllerInstance<M>;

export type ControllerInstance<M extends Module> = {
  [Lifecycle.Mount]?(parameters: M["Routes"]): void;
  [Lifecycle.Derive]?(attributes: M["Attributes"]): void;
  [Lifecycle.Tree]?(): void;
  [Lifecycle.Unmount]?(): void;
} & Partial<Handlers<M["Actions"]>>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (payload: Payload<A, K>) => Generator<any, any, never>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
