export const enum Transmit {
  Unicast,
  Multicast,
  Broadcast,
}

type ControllerArgs = {
  app: unknown;
  use: {
    produce(dispatch: unknown, fn: any): void;
  };
};

export type Actions = [any, any];

export type Model = Record<string, any>;

export type ControllerDefinition<A extends Actions> = ({
  app,
  use,
}: ControllerArgs) => Handlers<A>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (payload: Payload<A, K>) => void;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;

type ViewArgs<M extends Model, A extends Actions> = {
  model: M;
  use: {
    dispatch(event: A): void;
  };
};

export type ViewDefinition<M extends Model, A extends Actions> = ({
  use,
  model,
}: ViewArgs<M, A>) => any;
