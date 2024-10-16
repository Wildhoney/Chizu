import { Actions, Model, Reactive, Transmit } from "../types/index.ts";

type ControllerArgs<M extends Model, A extends Actions> = {
  model: M;
  actions: {
    dispatch(event: A): void;
    produce(transmit: Transmit, ƒ: (draft: M) => void): void;
    io<R>(ƒ: () => R): R;
  };
};

export type ControllerDefinition<M extends Model, A extends Actions> = (
  controller: ControllerArgs<M, A>,
) => Partial<Handlers<A>>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (
    payload: Payload<A, K>,
  ) => Generator<string, void, Reactive<never>>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
