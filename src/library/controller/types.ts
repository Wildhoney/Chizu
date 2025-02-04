import {
  Actions,
  Lifecycle,
  Model,
  Parameters,
  Props,
  Routes,
} from "../types/index.ts";

export type ControllerActions<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  io<T>(ƒ: () => T): () => T;
  produce(ƒ: (draft: M) => void): void;
  dispatch(event: A): void;
  navigate(route: R): void;
};

export type ControllerArgs<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  model: M;
  element: null | HTMLElement;
  actions: ControllerActions<M, A, R>;
};

export type ControllerDefinition<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P1 extends Props,
  P2 extends Parameters = undefined,
> = (controller: ControllerArgs<M, A, R>) => ControllerInstance<A, P1, P2>;

export type ControllerInstance<
  A extends Actions,
  P1 extends Props,
  P2 extends Parameters = undefined,
> = {
  [Lifecycle.Mount]?(arguments: { props: P1; route: P2 }): void;
  [Lifecycle.Unmount]?(): void;
} & Partial<Handlers<A>>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (payload: Payload<A, K>) => Generator<any, any, never>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
