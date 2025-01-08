import {
  Actions,
  Model,
  ReactiveProps,
  Routes,
  Transmit,
} from "../types/index.ts";

type ControllerArgs<M extends Model, A extends Actions, R extends Routes> = {
  model: ReactiveProps<M>;
  node: HTMLElement;
  actions: {
    io<R>(ƒ: () => R): R;
    produce(transmit: Transmit, ƒ: (draft: M) => void): void;
    dispatch(event: A): void;
    optimistic<T>(actual: T, optimistic: T): T;
  };
};

export type ControllerDefinition<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = (
  controller: ControllerArgs<M, A, R>,
) => { mount?(parameters: unknown): void; unmount?(): void } & Partial<
  Handlers<A>
>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (payload: Payload<A, K>) => Generator<string, void, never>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
