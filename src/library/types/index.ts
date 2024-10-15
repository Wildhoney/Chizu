export type Options = Record<string, unknown>;

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

const Pending = Symbol("pending");
const Failed = Symbol("failed");
const Optimistic = Symbol("optimistic");

export type Reactive<P> =
  | typeof Pending
  | typeof Failed
  | typeof Optimistic
  | P;

type ControllerArgs<M extends Model, A extends Actions> = {
  app: unknown;
  use: {
    // dispatch(event: A): void;
    produce(transmit: Transmit, ƒ: (draft: M) => void): void;
    io<R>(ƒ: () => R): R;
  };
};

export type Actions = [any] | [any, any];

export type Model = Record<string, any>;

export type ControllerDefinition<M extends Model, A extends Actions> = ({
  app,
  use,
}: ControllerArgs<M, A>) => Partial<Handlers<A>>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (
    payload: Payload<A, K>,
  ) => Generator<string, void, Reactive<never>>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;

type ViewArgs<M extends Model, A extends Actions> = {
  model: M;
  queue: {};
  attrs: Record<string, string>;
  inspect: {
    is<P>(property: P, state: State): boolean;
    not<P>(property: P, state: State): boolean;
    match<P>(property: P, state: State): boolean;
  };
  actions: {
    dispatch(event: A): void;
    dispatching(event: A | [A[0]]): boolean;
    match<P>(property: P, ƒ: (state: State) => string | P): void;
  };
};

export type ViewDefinition<M extends Model, A extends Actions> = ({
  model,
  actions,
}: ViewArgs<M, A>) => any;
