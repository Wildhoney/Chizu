import { Actions, Model, Parameters, Routes } from "../types/index.ts";

export type ControllerActions<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  io<R>(ƒ: () => R): Awaited<R>;
  produce(ƒ: (draft: M) => void): void;
  dispatch(event: A): void;
  optimistic<T>(actual: T, optimistic: T): T;
  navigate(route: R): void;
};

type ControllerArgs<M extends Model, A extends Actions, R extends Routes> = {
  model: M;
  element: null | HTMLElement;
  actions: ControllerActions<M, A, R>;
};

export type ControllerDefinition<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters = undefined,
> = (controller: ControllerArgs<M, A, R>) => ControllerInstance<A, P>;

export type ControllerInstance<
  A extends Actions,
  P extends Parameters = undefined,
> = { mount?(parameters: P): void; unmount?(): void } & Partial<Handlers<A>>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (payload: Payload<A, K>) => Generator<string, void, never>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
