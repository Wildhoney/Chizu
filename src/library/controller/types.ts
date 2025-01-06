import { Actions, Model, Reactive, Transmit } from "../types/index.ts";

type ControllerArgs<M extends Model, A extends Actions, R> = {
  model: M;
  actions: {
    io<R>(ƒ: () => R): R;
    produce(transmit: Transmit, ƒ: (draft: M) => void): void;
    dispatch(event: A): void;
  };
};

export type ControllerDefinition<M extends Model, A extends Actions, R> = (
  controller: ControllerArgs<M, A, R>,
) => Partial<Handlers<A>>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (
    payload: Payload<A, K>,
  ) => Generator<string, void, Reactive<never>>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
