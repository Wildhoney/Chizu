export const enum Transmit {
  Unicast = "unicast",
  Multicast = "multicast",
  Broadcast = "broadcast",
}

export const enum State {
  Pending = "pending",
  Failed = "failed",
  Optimistic = "optimistic",
}

type ControllerArgs<M extends Model> = {
  app: unknown;
  use: {
    dispatch(transmit: Transmit, ƒ: (draft: M) => void): void;
    io<R>(ƒ: () => R): R;
  };
};

export type Actions = [any, any];

export type Model = Record<string, any>;

export type ControllerDefinition<M extends Model, A extends Actions> = ({
  app,
  use,
}: ControllerArgs<M>) => Handlers<A>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (payload: Payload<A, K>) => void;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;

type ViewArgs<M extends Model, A extends Actions> = {
  model: M;
  use: {
    dispatch(event: A): void;
    is<P>(property: P, state: State): boolean;
    match<P>(property: P, ƒ: (state: State) => string | P): void;
  };
};

export type ViewDefinition<M extends Model, A extends Actions> = ({
  use,
  model,
}: ViewArgs<M, A>) => any;
