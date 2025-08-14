/* eslint-disable @typescript-eslint/no-explicit-any */
export class Draft<T> {
  constructor(public value: T) {}
}

export class State {
  static Operation = {
    Adding: 1,
    Removing: 2,
    Updating: 4,
    Moving: 8,
    Replacing: 16,
    Sorting: 32,
  };

  static Draft<T>(value: T): Draft<T> {
    return new Draft(value);
  }
}

export class Lifecycle {
  static Mount = Symbol("lifecycle/mount");
  static Node = Symbol("lifecycle/node");
  static Derive = Symbol("lifecycle/derive");
  static Error = Symbol("lifecycle/error");
  static Unmount = Symbol("lifecycle/unmount");
}

export type Pk<T> = undefined | symbol | T;

export type Task = PromiseWithResolvers<void>;

export type Process = symbol;

export type Operation = number;

export type Operations<T> = (Operation | Draft<T>)[];

export type Model<M = Record<string, unknown>> = M;

export const PayloadKey = Symbol("payload");

export type Payload<T = unknown> = string & { [PayloadKey]: T };

export type Props = Record<string, unknown>;

export type Action = symbol | string;

export type Actions<T = unknown> = {
  new (): unknown;
} & {
  [key: Payload<T>]: Payload<T>;
};

export type ActionsClass<AC extends Record<string, Payload<any>>> = {
  new (): unknown;
} & AC;

export type ActionInstance<M extends Model, AC extends ActionsClass<any>> = {
  [K in keyof AC as AC[K] extends Payload<any>
    ? K
    : never]: AC[K] extends Payload<infer P>
    ? ((context: Context<M, AC>, payload: P) => void) & { _payload: P }
    : never;
};

export type Context<M extends Model, AC extends ActionsClass<any>> = {
  model: M;
  signal: AbortSignal;
  actions: {
    produce(ƒ: (draft: M) => void): M;
    dispatch<A extends AC[keyof AC] & Payload<any>>(
      ...args: A[typeof PayloadKey] extends never
        ? [A]
        : [A, A[typeof PayloadKey]]
    ): void;
  };
};

export type UseActions<M extends Model, AC extends ActionsClass<any>> = [
  M,
  {
    dispatch<A extends AC[keyof AC] & Payload<any>>(
      ...args: A[typeof PayloadKey] extends never
        ? [A]
        : [A, A[typeof PayloadKey]]
    ): void;
  },
];
